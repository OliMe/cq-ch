var app = app || {};

(function () {
  'use strict';

  /**
   * Model for settlements
   */
  app.Ip = app.Model.extend({
    handlers: {
      request: {
        'user/QUERY_USER_IP': function (putQuery) {
          putQuery({ type: 'user/QUERY_USER_IP' }, 2000).then(
            this.ipQueryResolveHandler.bind(this),
            this.ipQueryErrorHandler.bind(this)
          );
        }
      },
      respond: {
        'user/QUERY_USER_IP': function (takeQuery) {
          var promise = takeQuery();
          if (promise && promise instanceof Promise) {
            promise.then(function (query) {
              if (this.get('ip')) {
                query.resolve(this.get('ip'));
              } else {
                this.listenToOnce(this, 'change:ip', function (model) {
                  query.resolve(model.get('ip'));
                })
                this.fetch();
              }
            }.bind(this));
          }
        }
      }
    },
    url: app.entryScript + 'https://api.ipify.org/?format=json',
    fetch: function () {
      if (!this.get('isFetching')) {
        return app.Model.prototype.fetch.apply(this, arguments)
      }
    },
    ipQueryResolveHandler: function (ip) {
      this.set({ ip: ip });
    },
    ipQueryErrorHandler: function (reason) {
      console.error(reason);
      this.fetch();
    },
  });
})();