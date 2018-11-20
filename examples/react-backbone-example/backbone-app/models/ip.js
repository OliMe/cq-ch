var app = app || {};

(function () {
  'use strict';
  
  /**
   * Model for settlements
   */
  app.Ip = app.Model.extend({
      url: app.entryScript + 'https://api.ipify.org/?format=json',
  });
})();