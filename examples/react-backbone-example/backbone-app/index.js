var app = app || {};

$(function () {
    'use strict'
    var formModel = new app.FormModel({ isField: false, current: null, name: '' }),
        ipModel = new app.Ip(),
        interfaceConfig = {
            command: {
                types: ['settlement/SET_CURRENT'],
                handlers: [
                    {
                        type: 'settlement/SET_CURRENT',
                        creator: formModel.createHandler.bind(formModel)
                    }
                ]
            },
            execute: {
                types: ['settlement/SET_CURRENT'],
                handlers: [
                    {
                        type: 'settlement/SET_CURRENT',
                        creator: formModel.createHandler.bind(formModel)
                    }
                ]
            },
            request: {
                types: ['user/QUERY_USER_IP'],
                handlers: [
                    {
                        type: 'user/QUERY_USER_IP',
                        creator: ipModel.createHandler.bind(ipModel)
                    }
                ]
            },
            respond: {
                types: ['user/QUERY_USER_IP'],
                handlers: [
                    {
                        type: 'user/QUERY_USER_IP',
                        creator: ipModel.createHandler.bind(ipModel)
                    }
                ]
            }
        };
    app.declareInterface(interfaceConfig, 'backbone-app', CQC);
    new app.SettlementForm({
        el: '#backbone-app',
        ip: ipModel,
        model: formModel,
        collection: new app.Settlements(),
        template: app.helpers.TemplateHelper.getTemplate('#settlement-form-template'),
        listTemplate: app.helpers.TemplateHelper.getTemplate('#settlement-list-template'),
    });
})
