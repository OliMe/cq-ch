var app = app || {};

$(function () {
    'use strict'
    var formModel = new app.Model({ isField: false, current: null, name: '' }),
        ipModel = new app.Ip(),
        externalInterfaceCfg = {
            command: {
                types: ['settlement/SET_CURRENT'],
                handlers: [
                    {
                        type: 'settlement/SET_CURRENT',
                        creator: formModel.createHandler
                    }
                ]
            },
            execute: {
                types: ['settlement/SET_CURRENT'],
                handlers: [
                    {
                        type: 'settlement/SET_CURRENT',
                        creator: formModel.createHandler
                    }
                ]
            },
            request: {
                types: ['user/QUERY_USER_IP'],
                handlers: [
                    {
                        type: 'user/QUERY_USER_IP',
                        creator: ipModel.createRequestHandler
                    }
                ]
            },
            respond: {
                types: ['user/QUERY_USER_IP'],
                handlers: [
                    {
                        type: 'user/QUERY_USER_IP',
                        creator: ipModel.createRespondHandler
                    }
                ]
            }
        };
    new app.SettlementForm({
        el: '#backbone-app',
        ip: new app.Ip(),
        bus: CQRSBus,
        model: new app.Model({ isField: false, current: null, name: '' }),
        collection: new app.Settlements(),
        template: app.helpers.TemplateHelper.getTemplate('#settlement-form-template'),
        listTemplate: app.helpers.TemplateHelper.getTemplate('#settlement-list-template'),
    });
})