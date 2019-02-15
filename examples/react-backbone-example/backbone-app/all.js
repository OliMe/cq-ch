// Libs
window.$ = window.jQuery = require('node_modules/jquery/dist/jquery.js');
window._ = require('node_modules/lodash/lodash.js');
window.Backbone = require('node_modules/backbone/backbone.js');
require('../../../dist/index.js');
// Helpers
require('./helpers/template-helper.js');
// Components
require('./models/model.js');
require('./collections/collection.js');
require('./views/view.js');
require('./external/external-interface.js');
// App entities
require('./models/form-model.js');
require('./models/ip.js');
require('./models/settlement.js');
require('./collections/settlements.js');
require('./views/settlement-form.js');
// Entry point
require('./index.js');
