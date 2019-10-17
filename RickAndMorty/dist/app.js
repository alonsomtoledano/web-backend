"use strict";

var _yargs = _interopRequireDefault(require("yargs"));

var _functions = require("./functions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

//LIST command
_yargs["default"].command({
  command: 'list',
  describe: 'main command to list different character data',
  builder: {
    page: {
      describe: 'Show name characters name by page',
      demandOption: false,
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
  handler: function handler(argv) {
    (0, _functions.list)(argv);
  }
});
/*
  //VIEW command
  yargs.command({
    command: 'view',
    describe: 'Show data information',
    builder:{
        name:{
            describe: 'Show name characters name by page',
            demandOption: true,
            type: 'string',
        },
    },
    handler: function(argv){
        view(argv);
    }
  });
*/


_yargs["default"].parse();