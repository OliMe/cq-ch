var app = app || {};

(function () {
    'use strict';

    var SET_CURRENT = 'settlement/SET_CURRENT';
    var COMMAND_SECTION = 'command';

    /**
     * Model for settlements
     */
    app.FormModel = app.Model.extend({
        handlers: (function () {
            var handlers = {};
            handlers[COMMAND_SECTION] = {};
            handlers[COMMAND_SECTION][SET_CURRENT] = function (putCommand) {
                this.listenTo(this, 'change:current', function (putCommand) {
                    putCommand({
                        type: SET_CURRENT,
                        current: this.get('current').toJSON(),
                    });
                });
            };
            return handlers;
        })(),
        createHandler: function (section, type) {
            if (
                this.handlers
                && _.isPlainObject(this.handlers)
                && _.isPlainObject(this.handlers[section])
                && _.isFunction(this.handlers[section][type])
            ) {
                return this.handlers[section][type].bind(this)
            }
        }
    });
})();