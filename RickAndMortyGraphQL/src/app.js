 import { fetchData } from './fetchdata';
 import { GraphQLServer } from 'graphql-yoga'

// rickymorty entry point
const url = 'https://rickandmortyapi.com/api/character/';

const runApp = data => {
  const typeDefs = `
type Query{
  character(id: Int!): Character!
  characters(page: Int, pageSize: Int, name: String, status: String, planet: String):[Character!]!
  planets: [String!]!
}

type Character{
  id: Int!
  name: String!
  status: String!
  planet: String!
}
`

const resolvers = {
  Query: {
    character: (parent, args, ctx, info) => {
      const result = data.find(obj => obj.id == args.id);
      
      if (result){
        return {
          id: result.id,
          name: result.name,
          status: result.status,
          planet: result.location.name
        }
      }
      else return null;
    },

    characters: (parent, args, ctx, info) => {
      const page = args.page || 1;
      const pageSize = args.pageSize || 20;
      let first = pageSize*(page - 1);
      let last = first + pageSize;
      let arrayResults = data.slice();

      if(args.name){
        arrayResults = arrayResults.filter(obj => obj.name.includes(args.name));
      }
      if(args.status){
        arrayResults = arrayResults.filter(obj => obj.status.includes(args.status));
      }
      if(args.planetas){
        arrayResults = arrayResults.filter(obj => obj.location.name.includes(args.planet));
      }

      return arrayResults
        .slice(first, last)
        .map(character => {
          return{
            id: character.id,
            name: character.name,
            status: character.status,
            planet: character.location.name
          }
      });
    },

    planets: () => {
      const array = [];
      data.forEach( (elem, i) => {
        array.push(data[i].location.name);
      })

      let result = array.filter((value, actualIndex, arr) => arr.indexOf(value) === actualIndex);
      return result;
    }
  }
}

  const server = new GraphQLServer({typeDefs, resolvers})
  server.start();
};

// main program
fetchData(runApp, url);