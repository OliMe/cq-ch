var app = app || {};
app.helpers = app.helpers || {};

(function ($) {
  'use strict';
  
  /**
   * Helper functions for template caching.
   */
  app.helpers.TemplateHelper = {
    cache: {},
    getTemplate: function (templateName) {
      if (!this.cache[templateName] || app.HAS_KARMA) {
        this.cache[templateName] = _.template($(templateName).html() || '');
      }
      return this.cache[templateName];
    },
    getJson: function (jsonName) {
      var json = null;
      try {
        json = JSON.parse($(jsonName).html() || '');
      } catch (e) {
        return null;
      }
      return json;
    },
  };
})(jQuery);
