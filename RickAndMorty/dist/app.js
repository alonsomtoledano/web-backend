"use strict";

var _yargs = _interopRequireDefault(require("yargs"));

var _functions = require("./functions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

//list command
_yargs["default"].command({
  command: 'list',
  describe: 'main command to list different stuff',
  builder: {
    page: {
      describe: 'Show characters name by page',
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
});

_yargs["default"].parse(); //initiate yargs