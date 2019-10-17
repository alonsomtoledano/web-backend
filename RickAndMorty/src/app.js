import yargs from 'yargs';

import {list, view} from './functions';

//LIST command
yargs.command({
    command: 'list',
    describe: 'main command to list different character data',
    builder:{
        page:{
            describe: 'Show name characters name by page',
            demandOption: false,
            type: 'number',
        },
        search:{
            describe: 'Search a character by name',
            demandOption: false,
            type: 'string',
        },
        status:{
            describe: 'Search characters by status',
            demandOption: false,
            type: 'string',
        }
    },
    handler: function(argv){
        list(argv);
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
  yargs.parse(); 