import { fetchData } from './fetchdata';
import { GraphQLServer } from 'graphql-yoga'

// rickymorty entry point
const url = 'https://rickandmortyapi.com/api/character/';

const typeDefs = `
type Query{
  hello(name: String!, edad: Int): String!
  me: Persona!
  nombre: [String!]!
}

type Persona{
  name: String!
  age: Int!
}
`

const resolvers = {
  Query: {
    hello: (parent, args, ctx, info) => {
      if (args.edad)
        return `Hello ${args.name}, tienes ${args.edad} años prro`
      else
        return `Hello ${args.name}`
    },
    me: () => {
      return{
        name: "Alonso",
        age: 12
      }
    },
    nombre: () => ["Hola", "de que vas"]
  }
}

/**
 * Main App
 * @param data all rickyandmorty database
 */
const runApp = data => {
  // data.forEach(element => {
  //   console.log(`${element.id}: ${element.name}`);
  // });
  const server = new GraphQLServer({typeDefs, resolvers})
  server.start();
};

// main program
fetchData(runApp, url);
