var app = app || {};

(function () {
    'use strict';

    /**
     * Basic collection
     */
    app.Collection = Backbone.Collection.extend({
        url: function () {
            var fragment = '/';
            if (this.expand) {
                fragment += '?' + this.expand;
            }
            if (this.requestParameters) {
                fragment += (this.expand ? '&' : '?') + this.requestParameters;
            }
            return this.urlRoot + fragment;
        },
        model: app.Model,
        parse: function (response) {
            return response.items;
        },
        initialize: function (models, options) {
            this.beforeRun(models, options);
            this.run(models, options);
            this.afterRun(models, options);
            this.fetchCounter = 0;
        },
        fetch: function () {
            this.fetchCounter++;
            return Backbone.Collection.prototype.fetch.apply(this, arguments);
        },
        beforeRun: function (models, options) { },
        run: function (models, options) { },
        afterRun: function (models, options) { }
    });
})();