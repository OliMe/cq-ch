var app = app || {};

(function () {
    'use strict';

    var SET_CURRENT = 'settlement/SET_CURRENT';

    /**
     * Model for SettlementForm
     */
    app.FormModel = app.Model.extend({
        handlers: {
            command: {
                'settlement/SET_CURRENT': function (putCommand) {
                    this.listenTo(this, 'change:current', function () {
                        putCommand({
                            type: SET_CURRENT,
                            current: this.get('current').toJSON(),
                        });
                    });
                }
            },
            execute: {
                'settlement/SET_CURRENT': function (takeCommand) {
                    var promise = takeCommand();
                    if (promise && promise instanceof Promise) {
                        promise.then(this.setCurrentListener.bind(this), function (reason) {
                            console.log(reason)
                        });
                    }
                }
            }
        },
        setCurrentListener: function (command) {
            if (
                command.current
                && command.current.id
                && (
                    !this.get('current')
                    || this.get('current').get('id') !== command.current.id
                )
            ) {
                this.set({ current: new app.Settlement(command.current) });
            }
        },
    });
})();