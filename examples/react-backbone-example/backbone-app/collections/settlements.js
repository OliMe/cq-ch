var app = app || {};

(function () {
  'use strict';

  /**
   * Collection for settlements
   */
  app.Settlements = app.Collection.extend({
    model: app.Settlement,
    urlRoot: '/api/v3/settlement',
  });
})();
