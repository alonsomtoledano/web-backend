import yargs from 'yargs';

import {list} from './functions';

//list command
yargs.command({
    command: 'list',
    describe: 'main command to list different stuff',
    builder:{
        page:{
            describe: 'Page of characters',
            demandOption: false,
            type: 'number',
        },
        search:{
            describe: 'Search a character by name',
            demandOption: false,
            type: 'string',
        },
    },
    handler: list,
  });  
  
  yargs.parse(); //initiate yargs