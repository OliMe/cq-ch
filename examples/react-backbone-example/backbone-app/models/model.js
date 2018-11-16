var app = app || {};

(function ($) {
  'use strict';

  /**
   * Basic model
   */
  app.Model = Backbone.Model.extend({
    additionalOptions: ['requestParameters'],
    requestParameters: {},
    /** 
     * Ovveride parent method, so that you can specify the expand options in the model 
     */
    url: function () {
      var parameters = $.param(this.requestParameters) || '',
        expand = this.expand || '',
        paramSymbol = parameters || expand ? '?' : '',
        paramUnionSymbol = parameters && expand ? '&' : '',
        fragment = '/' + paramSymbol + parameters + paramUnionSymbol + expand;
      return Backbone.Model.prototype.url.apply(this, arguments) + fragment;
    },
    beforeRun: function (data, options) {},
    run: function (data, options) {},
    afterRun: function (data, options) {},
    initialize: function (data, options) {
      this.attachOptions(options);
      this.beforeRun(data, options);
      this.run(data, options);
      this.afterRun(data, options);
    },
    /**
     * Save passed options if they are included in the additionalOptions array
     * @param {Object} options Оptions
     */
    attachOptions: function (options) {
      if (options) {
        this.additionalOptions.forEach(function (optionKey) {
          if (options.hasOwnProperty(optionKey)) {
            this[optionKey] = options[optionKey];
          }
        }.bind(this));
      }
    },
  });
})(jQuery);