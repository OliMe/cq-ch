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
      var params = this.params;
      if (clientIp) {
        params = _.merge(params, {
          data: {
            detect_by_ip: 1,
          },
          headers: {
            "x-client-ip": clientIp,
          },
        });
        this.fetch(params);
      }
    },
    fetchByName: function (name) {
      var params = this.params;
      if (name) {
        params = _.merge(params, {
          data: {
            name: name
          }
        })
        this.fetch(params);
      }
    }
  });
})();
