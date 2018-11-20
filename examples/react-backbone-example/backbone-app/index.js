var app = app || {};

$(function () {
    'use strict'

    new app.SettlementForm({
        el: '#backbone-app',
        ip: new app.Ip(),
        collection: new app.Settlements(),
        template: app.helpers.TemplateHelper.getTemplate('#settlement-form-template'),
    });
})