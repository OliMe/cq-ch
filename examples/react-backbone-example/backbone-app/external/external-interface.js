var app = app || {};

(function () {
    'use strict';

    var ExternalInterface = _.extend({
        handlers: {},
        register: function (config, context) {
            if (_.isPlainObject(config)) {
                for (var section in config) {
                    if (config.hasOwnProperty(section)) {
                        this.initHandlers(section, config, context)
                    }
                }
            }
        },
        initHandlers: function (section, config, context) {
            if (_.isPlainObject(config)) {
                var types = config.types,
                    handlers = config.handlers,
                    channelCreator = this._getBusFunctionForSection(section),
                    channel;
                if (_.isFunction(channelCreator)) {
                    if (_.isString(types)) {
                        types = [types]
                    }
                    var channel = channelCreator(types, context),
                        handlers = config.handlers;
                    if (handlers && _.isArray(handlers)) {
                        handlers.forEach(function (handler) {
                            var type = handler.type,
                                handlerCreator = handler.creator,
                                handler = _.isFunction(handlerCreator) && handlerCreator(section, type);
                            if (_.isFunction(handler)) {
                                if (!this.handlers[section]) {
                                    this.handlers[section] = [];
                                }
                                this.handlers[section].push({
                                    running: false,
                                    handler: handler,
                                    channel: this._prepareChannel(section, type, channel),
                                    type: type
                                });
                            }
                        }.bind(this));
                    }
                }
            }
        },
        run: function () {
            runners = {
                command: function (handlers) {
                    handlers.forEach(function (handler) {
                        if (!handler.running) {
                            handler.running = true;
                            handler.handler(handler.channel);
                        }
                    });
                },
                execute: function (handlers) {
                    var notRunning = handlers.filter(function (value) {
                        return !value.running;
                    });
                    if (notRunning.length) {
                        return setInterval(function () {
                            notRunning.forEach(function (value) {
                                value.handler(handler.channel)
                            });
                        }, 0);
                    }
                },
                request: function (handlers) {

                },
                respond: function (handlers) {

                }
            }
        },
        _getBusFunctionForSection(section) {
            return _.isFunction(CQRSBus[section]) && CQRSBus[section];
        },
        _prepareChannel(section, type, channel) {
            return ['execute', 'respond'].includes(section) ? channel(type) : channel;
        }
    }, Backbone.Events);

})();