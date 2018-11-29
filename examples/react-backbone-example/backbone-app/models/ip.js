var app = app || {};

(function () {
  'use strict';
  
  /**
   * Model for settlements
   */
  app.Ip = app.Model.extend({
      url: app.entryScript + 'https://api.ipify.org/?format=json',
      fetch: function () {
        if (!this.get('isFetching')) {
          return app.Model.prototype.fetch.apply(this, arguments)
        }
      }
  });
})();