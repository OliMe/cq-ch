var app = app || {};

(function () {
  'use strict';

  /**
   * Basic view
   */
  app.View = Backbone.View.extend({
    attachedOptions: ['settlement', 'template'],
    additionalOptions: [],

    /**
     * Run before initialization.
     * @param {Object} data Data passed to constructor
     * @abstract
     */
    beforeRun: function (data) {},

    /**
     * Initialize view.
     * @param {Object} data Data passed to constructor
     * @abstract
     */
    run: function (data) {},

    /**
     * Run after initialization.
     * @param {Object} data Data passed to constructor
     * @abstract
     */
    afterRun: function (data) {},

    /** @inheritDoc */
    initialize: function (data) {
      this.childViews = {};
      this.attachOptions(data);
      this.beforeRun(data);
      this.run(data);
      this.afterRun(data);
    },

    /**
     * Updates element inner html if template exists.
     * @param {Object} [data] Object with data to pass in template function.
     * @abstract
     */
    render: function (data) {
      data = data || {};
      if(_.isFunction(this.template)) {
        this.$el.html(this.template(data));
      }
    },

    /**
     * Save passed options if they are included in the additionalOptions array
     * @param {Object} options Опции
     */
    attachOptions: function (options) {
      if (!options) {
        return;
      }
      var optionList = _.union(this.attachedOptions, this.additionalOptions);
      optionList.forEach(function (optionName) {
        if (options.hasOwnProperty(optionName) && typeof options[optionName] !== 'undefined') {
          this[optionName] = options[optionName];
        }
      }.bind(this));
    },

    /**
     * Show/hide view`s element during the specified time.
     * @param {Number} time Time for show or hide element
     */
    toggle: function (time) {
      time = isNaN(time)
        ? 500
        : Number(time);
      this.$el.stop(true, true).animate({
        height: 'toggle',
        opacity: 'toggle',
      }, time);
    },

    /**
     * Remove view and all child views.
     */
    remove: function () {
      if (this.childViews) {
        this._removeChildViews();
      }
      Backbone.View.prototype.remove.apply(this, arguments);
    },

    /**
     * Remove child views recursively.
     * @protected
     */
    _removeChildViews: function () {
      for (var view in this.childViews) {
        if (this.childViews.hasOwnProperty(view)) {
          if (_.isArray(this.childViews[view])) {
            // If Array, flat it and apply remove() to all elements
            _.flatten(this.childViews[view]).forEach(function (item) {
              item.remove();
            });
          } else {
            this.childViews[view].remove();
          }
        }
      }
    },
  });

})();