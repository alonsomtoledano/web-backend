import { MongoClient, ObjectID } from "mongodb";
import { GraphQLServer } from "graphql-yoga";

import "babel-polyfill";

const usr = "alonso";
const pwd = "12345";
const url = "cluster0-uuiaf.gcp.mongodb.net/test";


/**
 * Connects to MongoDB Server and returns connected client
 * @param {string} usr MongoDB Server user
 * @param {string} pwd MongoDB Server pwd
 * @param {string} url MongoDB Server url
 */
const connectToDb = async function(usr, pwd, url) {
  const uri = `mongodb+srv://${usr}:${pwd}@${url}`;
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  await client.connect();
  return client;
};

/**
 * Starts GraphQL server, with MongoDB Client in context Object
 * @param {client: MongoClinet} context The context for GraphQL Server -> MongoDB Client
 */
const runGraphQLServer = function(context) {
  const typeDefs = `
    type Query {
      ingredients: [Ingredient!]
    }

    type Mutation{
      addAuthor(name: String!, email: String!): Author!
      addIngredient(name: String!): Ingredient!
      addRecipe(title: String!, description: String!, author: ID!, ingredients: [ID!]): Recipe!
      removeAuthor(id: ID!): Author
      removeIngredient(id: ID!): Ingredient
      removeRecipe(id: ID!): Recipe
    }

    type Recipe {
      id: ID!
      title: String!
      description: String!
      date: String!
      author: Author!
      ingredients: [Ingredient!]!
    }

    type Author {
      id: ID!
      name: String!
      email: String!
    }

    type Ingredient {
      id: ID!
      name: String!
    }
    `;

  const resolvers = {
    Query: {
      ingredients: async (parent, args, ctx, info) => {
        const { client } = ctx;
        const db = client.db("recipesDatabase");
        const collection = db.collection("ingredients");
        const result = await collection.find({}).toArray();
        return result;
      }
    },
    Mutation: {
      addAuthor: async (parent, args, ctx, info) => {
        const { name, email } = args;
        const { client } = ctx;

        const db = client.db("recipesDatabase");
        const collection = db.collection("authors");
        const result = await collection.insertOne({ name, email });

        return {
          id: result.ops[0]._id,
          name,
          email
        };
      },
      addIngredient: async (parent, args, ctx, info) => {
        const { name } = args;
        const { client } = ctx;

        const db = client.db("recipesDatabase");
        const collection = db.collection("ingredients");
        const result = await collection.insertOne({ name });

        return {
          id: result.ops[0]._id,
          name
        };
      },
      addRecipe: async (parent, args, ctx, info) => {
        const { title, description, author, ingredients } = args;
        const { client } = ctx;

        const db = client.db("recipesDatabase");
        const collection = db.collection("recipes");
        const result = await collection.insertOne({ title, description, author, ingredients });

        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        return {
          id: result.ops[0]._id,
          title,
          description,
          date: `${day}/${month}/${year}`,
          author: [],
          ingredients: []
        };
      },
      removeAuthor: async (parent, args, ctx, info) => {
        const { id } = args;
        const { client } = ctx;
        const db = client.db("recipesDatabase");
        const collection = db.collection("authors");
        await collection.findOneAndDelete({ _id: ObjectID(id) });

        const collectionRecipe = db.collection("recipes");
        await collectionRecipe.findOneAndDelete({ author: id });
      },
      removeIngredient: async (parent, args, ctx, info) => {
        const { id } = args;
        const { client } = ctx;
        const db = client.db("recipesDatabase");
        const collection = db.collection("ingredients");
        await collection.findOneAndDelete({ _id: ObjectID(id) });

        const collectionRecipe = db.collection("recipes");
        await collectionRecipe.findOneAndDelete({ ingredients: id });
      },
      removeRecipe: async (parent, args, ctx, info) => {
        const { id } = args;
        const { client } = ctx;
        const db = client.db("recipesDatabase");
        const collection = db.collection("recipes");
        await collection.findOneAndDelete({ _id: ObjectID(id) });
      },
    }
  };

  const server = new GraphQLServer({ typeDefs, resolvers, context });
  const options = {
    port: 8000
  };

  try {
    server.start(options, ({ port }) =>
      console.log(
        `Server started, listening on port ${port} for incoming requests.`
      )
    );
  } catch (e) {
    console.info(e);
    server.close();
  }
};

const runApp = async function() {
  const client = await connectToDb(usr, pwd, url);
  console.log("Connect to Mongo DB");
  try {
    runGraphQLServer({ client });
  } catch (e) {
    client.close();
  }
};

runApp();
