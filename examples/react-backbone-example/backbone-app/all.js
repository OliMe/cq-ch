// Libs
window.$ = window.jQuery = require('node_modules/jquery/dist/jquery.js');
window._ = require('node_modules/lodash/lodash.js');
window.Backbone = require('node_modules/backbone/backbone.js');
// Helpers
require('./helpers/template-helper.js');
// Components
require('./models/model.js');
require('./collections/collection.js');
require('./views/view.js');
// App entities
require('./models/settlement.js');
require('./collections/settlements.js');
require('./views/settlement-form.js');
// Entry point
require('./index.js');