var app = app || {};

(function () {
  'use strict';

  /**
   * View for settlement form
   */
  app.SettlementForm = app.View.extend({
    isField: false,
    current: null,
    name: '',
    events: {
      'click .current-settlement': 'toggleIsField',
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
      if (!this.current) {
        this.current = collection.at(0);
      }
      var renderPayload = {
        data: {
          current: this.current.toJSON(),
          isField: this.isField,
        },
        template: this.template,
        dest: this.$el,
      }
      if (this.name) {
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
      this.isField = !this.isField;
      this.collection.reset(null, { silent: true });
      this.trigger('render', {
        data: {
          current: this.current.toJSON(),
          isField: this.isField,
        },
        template: this.template,
        dest: this.$el,
      });
      if (this.isField) {
        this.$('.settlement-search').focus();
      } else {
        this.name = '';
      }
    },
    changeName: function (e) {
      if (this.name !== this.$(e.currentTarget).val() && this.$(e.currentTarget).val().length > 2) {
        this.name = this.$(e.currentTarget).val();
        if (this.name.length > 2) {
          this.collection.fetchByName(this.name);
        }
      }
    },
    render: function (payload) {
      payload.dest.html(app.View.prototype.render.apply(this, [payload.data, payload.template]));
    },
  });
})();