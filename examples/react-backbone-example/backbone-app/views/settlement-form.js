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
    additionalOptions: ['ip'],
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
      this.trigger('render');
    },
    toggleIsField: function () {
      this.isField = !this.isField;
      this.collection.reset(null, { silent: true });
      this.trigger('render');
    },
    changeName: function (e) {
      this.name = this.$(e.currentTarget).val();
      if (this.name.length > 2) {
        this.collection.fetchByName(this.name);
      }
    },
    render: function () {
      console.error(this.name, this.current.toJSON(), this.collection.toJSON(), this.isField);
      app.View.prototype.render.apply(this, [{
        name: this.name,
        current: this.current.toJSON(), 
        list: this.collection.toJSON(), 
        isField: this.isField
      }]);
      if (this.isField) {
        this.$('.settlement-search').focus();
      }
    },
  });
})();