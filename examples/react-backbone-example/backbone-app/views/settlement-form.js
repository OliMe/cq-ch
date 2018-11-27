var app = app || {};

(function () {
  'use strict';

  /**
   * View for settlement form
   */
  app.SettlementForm = app.View.extend({
    events: {
      'click .current-settlement': 'toggleIsField',
      'click .settlement-list li': 'selectCurrent',
      'keyup .settlement-search': 'changeName',
      'focusout .settlement-search': 'toggleIsField',
    },
    additionalOptions: ['ip', 'listTemplate'],
    run: function () {
      this.listenTo(this.ip, 'sync', this.onIpSync);
      this.listenTo(this.collection, 'sync', this.onSync);
      this.listenTo(this, 'render', this.render);
      this.ip.fetch();
    },
    onIpSync: function (ip) {
      this.collection.fetchByIp(ip.get('ip'));
    },
    onSync: function (collection) {
      if (!this.model.get('current')) {
        this.model.set({ current: collection.at(0) });
      }
      var renderPayload = {
        data: {
          current: this.model.get('current').toJSON(),
          isField: this.model.get('isField'),
        },
        template: this.template,
        dest: this.$el,
      }
      if (this.model.get('name')) {
        renderPayload = {
          data: {
            list: this.collection.toJSON()
          },
          template: this.listTemplate,
          dest: this.$('.settlement-list')
        }
      }
      this.trigger('render', renderPayload);
    },
    toggleIsField: function () {
      this.timer && clearTimeout(this.timer);
      this.timer = setTimeout(function () {
        this.model.set({ isField: !this.model.get('isField') });
        this.collection.reset(null, { silent: true });
        this.trigger('render', {
          data: {
            current: this.model.get('current').toJSON(),
            isField: this.model.get('isField'),
          },
          template: this.template,
          dest: this.$el,
        });
        if (this.model.get('isField')) {
          this.$('.settlement-search').focus();
        } else {
          this.model.set({name: ''});
        }
      }.bind(this), 150);
    },
    changeName: function (e) {
      if (this.model.get('name') !== this.$(e.currentTarget).val() && this.$(e.currentTarget).val().length > 2) {
        this.model.set({ name: this.$(e.currentTarget).val() });
        if (this.model.get('name').length > 2) {
          this.collection.fetchByName(this.model.get('name'));
        }
      }
    },
    selectCurrent: function (e) {
      var selectedSettlementId = this.$(e.currentTarget).data('settlement-id');
      if (selectedSettlementId) {
        var current = this.collection.get(selectedSettlementId);
        if (current && current instanceof app.Settlement) {
          this.model.set({ current: current });
        }
      }
      this.toggleIsField();
    },
    render: function (payload) {
      payload.dest.html(app.View.prototype.render.apply(this, [payload.data, payload.template]));
    },
  });
})();