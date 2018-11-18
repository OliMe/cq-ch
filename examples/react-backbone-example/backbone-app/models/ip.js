var app = app || {};

(function () {
  'use strict';
  
  /**
   * Model for settlements
   */
  app.Ip = app.Model.extend({
      url: 'https://api.ipify.org/?format=json',
      parse: function (response) {
        return response.data;
      }
  });
})();