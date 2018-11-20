var app = app || {};

(function () {
  'use strict';

  /**
   * Collection for settlements
   */
  app.Settlements = app.Collection.extend({
    model: app.Settlement,
    urlRoot: app.entryScript + 'https://www.sima-land.ru/api/v3/settlement',
    fetchParams: {
      data: {
        perPage: 10,
      },
    },
    fetchByIp: function (clientIp) {
      var params = this.fetchParams;
      if (clientIp) {
        params = _.merge({
          data: {
            detect_by_ip: 1,
          },
          headers: {
            "x-client-ip": clientIp,
          },
        }, params);
        this.fetch(params);
      }
    },
    fetchByName: function (name) {
      var params = this.fetchParams;
      if (name) {
        params = _.merge({
          data: {
            name: name
          }
        }, params)
        this.fetch(params);
      }
    }
  });
})();
