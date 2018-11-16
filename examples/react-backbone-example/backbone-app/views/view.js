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
     * Выполняется перед инициализацией.
     * @param {Object} data Данные, переданные в конструктор.
     * @abstract
     */
    beforeRun: function (data) {},

    /**
     * Инициализирует представление.
     * @param {Object} data Данные, переданные в конструктор.
     * @abstract
     */
    run: function (data) {},

    /**
     * Выполняется после инициализации.
     * @param {Object} data Данные, переданные в конструктор.
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
     * Обновляет содержимое элемента при наличии шаблона.
     * @param {Object} [data] Объект с данными для передачи в шаблон.
     * @abstract
     */
    render: function (data) {
      data = data || {};
      if(_.isFunction(this.template)) {
        this.$el.html(this.template(data));
      }
    },

    /**
     * Сохраняем переданные опции,
     * если они входят в массив attachedOptions
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
     * Показывает/скрывает элемент вью за указанное время
     * @param {Number} time Время за которое показывается/скрывается элемент вью
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
     * Удаляет вид и все дочерние виды.
     */
    remove: function () {
      if (this.childViews) {
        this._removeChildViews();
      }
      Backbone.View.prototype.remove.apply(this, arguments);
    },

    /**
     * Рекурсивно удаляет дочерние виды.
     * @protected
     */
    _removeChildViews: function () {
      for (var view in this.childViews) {
        if (this.childViews.hasOwnProperty(view)) {
          if (_.isArray(this.childViews[view])) {
            // Если массив, убираем вложенность и применяем remove() ко всем элементам
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