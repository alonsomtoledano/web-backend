import yargs from 'yargs';
import fs from 'fs';
import uuid from 'uuid';


let obj;

//add function
const add = function(argv){
  const nota = {
    uuid: uuid.v4(),
    title: argv.title,
    body: argv.body,
    author: argv.author,
  };

  obj.notes.push(nota);
  console.log(`Added: ${nota.title}`);
}

//read function
const read = function(argv){
  obj.notes.forEach( (note, i) => {
    if(argv.uuid == note.uuid) console.log(note);
  })
}

//list function
const list = function(){
  obj.notes.forEach( (note, i) => {
    console.log(` Nota numero ${i+1}: ${note.title}`);
  })
}

//remove function
const remove = function(argv){
  //obj.notes.splice(0, 1, argv.uuid);

  obj.notes.forEach( (note, i) => {
    obj.notes.splice (obj.notes.indexOf(note.uuid), 1);
    // if(argv.uuid == note.uuid) {
    //   obj.notes.splice (obj.notes.indexOf(note.uuid), 1);
    // }
  })
}

// add command
yargs.command({
  command: 'add',
  describe: 'add a new note',
  builder: {
    title: {
      describe: 'Title of the note',
      demandOption: true,
      type: 'string',
    },
    body: {
      describe: 'body of the note',
      demandOption: true,
      type: 'string',
    },
    author: {
      describe: 'body of the note',
      demandOption: true,
      type: 'string',
    },
  },
  handler: add,
});

//read command
yargs.command({
  command: 'read',
  describe:'read notes by uuid',
  builder: {
    uuid: {
      describe: 'uuid of the note',
      demandOption: true,
      type: 'string',
    },
  },
  handler: read,
});

//list command
yargs.command({
  command: 'list',
  describe: 'list notes by title',
  handler: list,
});

//remove command
yargs.command({
  command: 'remove',
  describe:'remove note by uuid',
  builder: {
    uuid: {
      describe: 'uuid of the note',
      demandOption: true,
      type: 'string',
    },
  },
  handler: remove,
});

const path = './notas.txt';
fs.access(path, fs.F_OK, (err) => {
  if (err) {
    fs.writeFileSync("notas.txt","");
  }

  const data = fs.readFileSync("notas.txt").toString();

  if(data !== ""){
    obj = JSON.parse(data);
  }else{
    obj = {
      notes: [

      ]
    };
  }

  yargs.parse();
  fs.writeFileSync("notas.txt", JSON.stringify(obj));
});