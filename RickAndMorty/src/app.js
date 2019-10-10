import yargs from 'yargs';

import {list, view} from './functions';

//list command
yargs.command({
    command: 'list',
    describe: 'main command to list different character data',
    builder:{
        page:{
            describe: 'Show name characters name by page',
            demandOption: true,
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
    handler: list,
  });

  //view command
  yargs.command({
    command: 'view',
    describe: 'Show data information',
    builder:{
        page:{
            describe: 'Page',
            demandOption: true,
            type: 'number',
        },
        name:{
            describe: 'Show name characters name by page',
            demandOption: true,
            type: 'string',
        },
    },
    handler: view,
  });

  yargs.parse(); //initiate yargs