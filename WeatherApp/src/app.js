import yargs from 'yargs';

import {search} from './functions';

//search command
yargs.command({
  command: 'search',
  describe: 'search a location',
  builder: {
    location: {
      describe: 'Locations name',
      demandOption: true,
      type: 'string',
    },
    index: {
      describe: 'body of the note',
      demandOption: false,
      type: 'number',
    },
  },
  handler: search,
});

yargs.parse(); //initiate yargs