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
    additionalOptions: ['ip', 'listTemplate', 'bus'],
    queries: {},
    run: function () {
      var putCommand = this.bus.command(['settlement/SET_CURRENT'], 'backbone-app/settlement'),
        putQuery = this.bus.request(['user/QUERY_USER_IP'], 'backbone-app/user'),
        takeCommand = this.bus.execute(['settlement/SET_CURRENT'], 'backbone-app/settlement')(),
        takeQuery = this.bus.respond(['user/QUERY_USER_IP'], 'backbone-app/user')();
      putQuery({ type: 'user/QUERY_USER_IP' }, 2000).then(function (ip) {
        this.ip.set({ ip: ip })
      }.bind(this), function (reason) {
        console.log('backbone-app', reason);
        this.ip.fetch();
      }.bind(this));
      setInterval(function () {
        var promise = takeCommand();
        if (promise && promise instanceof Promise) {
          promise.then(this.setCurrentListener.bind(this), function (reason) {
            console.log(reason)
          })
        }
      }.bind(this), 0);
      setInterval(function () {
        var promise = takeQuery();
        if (promise && promise instanceof Promise) {
          promise.then(function (query) {
            if (this.ip.get('ip')) {
              query.resolve(this.ip.get('ip'));
            } else {
              this.listenToOnce(this.ip, 'change:ip', function (model) {
                query.resolve(model.get('ip'));
              })
              this.ip.fetch();
            }
          }.bind(this));
        }
      }.bind(this), 0);
      this.listenTo(this.ip, 'change:ip', this.onIpChange);
      this.listenTo(this.collection, 'sync', this.onSync);
      this.listenTo(this, 'render', this.render);
      this.listenTo(this.model, 'change', this.initRender);
      this.listenTo(this.model, 'change:current', function () {
        putCommand({
          type: 'settlement/SET_CURRENT',
          current: this.model.get('current').toJSON(),
        });
      });
    },
    onIpChange: function (ip) {
      this.collection.fetchByIp(ip.get('ip'));
    },
    setCurrentListener: function (command) {
      if (
        command.current
        && command.current.id
        && (
          !this.model.get('current')
          || this.model.get('current').get('id') !== command.current.id
        )
      ) {
        this.model.set({ current: new app.Settlement(command.current) });
      }
    },
    initRender: function () {
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
    onSync: function (collection) {
      if (!this.model.get('current')) {
        this.model.set({ current: collection.at(0) });
      }
      this.model.set({ isFetch: false });
    },
    toggleIsField: function () {
      this.timer && clearTimeout(this.timer);
      this.timer = setTimeout(function () {
        this.model.set({ isField: !this.model.get('isField') });
        this.collection.reset(null, { silent: true });
        if (!this.model.get('isField')) {
          this.model.set({ name: '' });
        } else {
          this.$('.settlement-search').focus();
        }
      }.bind(this), 150);
    },
    changeName: function (e) {
      if (this.model.get('name') !== this.$(e.currentTarget).val() && this.$(e.currentTarget).val().length > 2) {
        this.model.set({ name: this.$(e.currentTarget).val() });
        if (this.model.get('name').length > 2) {
          this.model.set({ isFetch: true });
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