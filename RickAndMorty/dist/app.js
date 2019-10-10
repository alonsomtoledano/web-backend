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
      describe: 'Page of characters',
      demandOption: false,
      type: 'number'
    }
  },
  handler: _functions.list
});

_yargs["default"].parse(); //initiate yargs