"use strict";

var _yargs = _interopRequireDefault(require("yargs"));

var _functions = require("./functions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

//list command
_yargs["default"].command({
  command: 'list',
  describe: 'main command to list different character data',
  builder: {
    page: {
      describe: 'Show name characters name by page',
      demandOption: true,
      type: 'number'
    },
    search: {
      describe: 'Search a character by name',
      demandOption: false,
      type: 'string'
    },
    status: {
      describe: 'Search characters by status',
      demandOption: false,
      type: 'string'
    }
  },
  handler: _functions.list
}); //view command


_yargs["default"].command({
  command: 'view',
  describe: 'Show data information',
  builder: {
    page: {
      describe: 'Page',
      demandOption: true,
      type: 'number'
    },
    name: {
      describe: 'Show name characters name by page',
      demandOption: true,
      type: 'string'
    }
  },
  handler: _functions.view
});

_yargs["default"].parse(); //initiate yargs