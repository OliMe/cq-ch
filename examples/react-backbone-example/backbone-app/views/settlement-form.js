var app = app || {};

(function ($) {
  'use strict';

  /**
   * View for settlement form
   */
  app.SettlementForm = app.View.extend({
    isField: false,
    current: null,
    events: {},
    additionalOptions: ['ip'],
    run: function () {
      this.ip.fetch();
      this.listenTo(this.ip, 'sync', this.onIpSync)
      this.listenTo(this.collection, 'sync', this.onSync);
    },
    onSync: function (collection) {
      if (!this.current) {
        this.current = collection.at(0);
      }
      this.render({
        current: this.current.toJSON(), 
        list: this.collection.toJSON(), 
        isField: this.isField
      });
    },
    onIpSync: function (ip) {
      this.collection.fetchByIp(ip.get('ip'));
    }
  });
});