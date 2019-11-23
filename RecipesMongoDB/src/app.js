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
      updateAuthor(id: ID!, name: String, email: String): Author!
      updateIngredient(id: ID!, name: String!): Ingredient!
      updateRecipe(id:ID!, title: String, description: String, author: ID, ingredients: [ID!]): Recipe!
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

        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        const db = client.db("recipesDatabase");
        const collection = db.collection("recipes");
        const result = await collection.insertOne({ title, description, date: `${day}/${month}/${year}`, author, ingredients });

        return {
          id: result.ops[0]._id,
          title,
          description,
          date,
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

        let findRecipe = await collectionRecipe.findOne({ author: id });

        while(findRecipe){
          await collectionRecipe.findOneAndDelete({ author: id });
          findRecipe = await collectionRecipe.findOne({ author: id });
        }
      },
      removeIngredient: async (parent, args, ctx, info) => {
        const { id } = args;
        const { client } = ctx;
        const db = client.db("recipesDatabase");
        const collection = db.collection("ingredients");
        await collection.findOneAndDelete({ _id: ObjectID(id) });

        const collectionRecipe = db.collection("recipes");

        let findRecipe = await collectionRecipe.findOne({ ingredients: id });

        while(findRecipe){
          await collectionRecipe.findOneAndDelete({ ingredients: id });
          findRecipe = await collectionRecipe.findOne({ ingredients: id });
        }
      },
      removeRecipe: async (parent, args, ctx, info) => {
        const { id } = args;
        const { client } = ctx;
        const db = client.db("recipesDatabase");
        const collection = db.collection("recipes");
        await collection.findOneAndDelete({ _id: ObjectID(id) });
      },
      updateAuthor: async (parent, args, ctx, info) => {
        const { id, name, email } = args;
        const { client } = ctx;
        const db = client.db("recipesDatabase");
        const collection = db.collection("authors");

        const author = await collection.findOne({ _id: ObjectID(id) })

        await collection.findOneAndUpdate({ _id: ObjectID(id) },
          {$set: { name: name || author.name,
            email: email || author.email}});
      },
      updateIngredient: async (parent, args, ctx, info) => {
        const { id, name } = args;
        const { client } = ctx;
        const db = client.db("recipesDatabase");
        const collection = db.collection("ingredients");

        await collection.findOneAndUpdate({ _id: ObjectID(id) }, {$set: { name: name }});
      },
      updateRecipe: async (parent, args, ctx, info) => {
        const { id, title, description, author, ingredients } = args;
        const { client } = ctx;
        const db = client.db("recipesDatabase");
        const collection = db.collection("recipes");

        const recipe = await collection.findOne({ _id: ObjectID(id) });

        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        await collection.findOneAndUpdate({ _id: ObjectID(id) },
          {$set: { title: title || recipe.title,
            description: description || recipe.description,
            date: `${day}/${month}/${year}`,
            author: author || recipe.author,
            ingredients: ingredients || recipe.ingredients}});
      }
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
