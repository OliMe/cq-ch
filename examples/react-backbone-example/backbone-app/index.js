var app = app || {};

$(function () {
    'use strict'

    new app.SettlementForm({
        el: '#backbone-app',
        ip: new app.Ip(),
        model: new app.Model({ isField: false, current: null, name: '' }),
        collection: new app.Settlements(),
        template: app.helpers.TemplateHelper.getTemplate('#settlement-form-template'),
        listTemplate: app.helpers.TemplateHelper.getTemplate('#settlement-list-template'),
    });
})