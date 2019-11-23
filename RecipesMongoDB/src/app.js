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
      authors: [Author!]
      ingredients: [Ingredient!]
      recipes: [Recipe!]
    }

    type Mutation{
      addAuthor(name: String!, email: String!): Author!
      addIngredient(name: String!): Ingredient!
      addRecipe(title: String!, description: String!, author: ID!, ingredients: [ID!]): Recipe!
      removeAuthor(_id: ID!): Author
      removeIngredient(_id: ID!): Ingredient
      removeRecipe(_id: ID!): Recipe
      updateAuthor(_id: ID!, name: String, email: String): Author!
      updateIngredient(_id: ID!, name: String!): Ingredient!
      updateRecipe(_id:ID!, title: String, description: String, author: ID, ingredients: [ID!]): Recipe!
    }

    type Recipe {
      _id: ID!
      title: String!
      description: String!
      date: String!
      author: Author!
      ingredients: [Ingredient!]!
    }

    type Author {
      _id: ID!
      name: String!
      email: String!
    }

    type Ingredient {
      _id: ID!
      name: String!
    }
    `;

  const resolvers = {
    Query: {
      authors: async (parent, args, ctx, info) => {
        const { client } = ctx;
        const db = client.db("recipesDatabase");
        const collection = db.collection("authors");
        return await collection.find({}).toArray();
      },
      ingredients: async (parent, args, ctx, info) => {
        const { client } = ctx;
        const db = client.db("recipesDatabase");
        const collection = db.collection("ingredients");
        return await collection.find({}).toArray();
      },
      recipes: async (parent, args, ctx, info) => {
        const { client } = ctx;
        const db = client.db("recipesDatabase");
        const collection = db.collection("recipes");
        return await collection.find({}).toArray();
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
          _id: result.ops[0]._id,
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
          _id: result.ops[0]._id,
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
          _id: result.ops[0]._id,
          title,
          description,
          date,
          author,
          ingredients
        };
      },
      removeAuthor: async (parent, args, ctx, info) => {
        const { _id } = args;
        const { client } = ctx;
        const db = client.db("recipesDatabase");
        const collection = db.collection("authors");

        const findAuthor = await collection.findOne({ _id: ObjectID(_id) });
        await collection.findOneAndDelete({ _id: ObjectID(_id) });

        const collectionRecipe = db.collection("recipes");

        let findRecipe = await collectionRecipe.findOne({ author: _id });

        while(findRecipe){
          await collectionRecipe.findOneAndDelete({ author: _id });
          findRecipe = await collectionRecipe.findOne({ author: _id });
        }

        return findAuthor;
      },
      removeIngredient: async (parent, args, ctx, info) => {
        const { _id } = args;
        const { client } = ctx;
        const db = client.db("recipesDatabase");
        const collection = db.collection("ingredients");

        const findIngredient = await collection.findOne({ _id: ObjectID(_id) });
        await collection.findOneAndDelete({ _id: ObjectID(_id) });

        const collectionRecipe = db.collection("recipes");

        let findRecipe = await collectionRecipe.findOne({ ingredients: _id });

        while(findRecipe){
          await collectionRecipe.findOneAndDelete({ ingredients: _id });
          findRecipe = await collectionRecipe.findOne({ ingredients: _id });
        }

        return findIngredient;
      },
      removeRecipe: async (parent, args, ctx, info) => {
        const { _id } = args;
        const { client } = ctx;
        const db = client.db("recipesDatabase");
        const collection = db.collection("recipes");
        const findRecipe = await collection.findOne({ _id: ObjectID(_id) });
        await collection.findOneAndDelete({ _id: ObjectID(_id) });

        return findRecipe;
      },
      updateAuthor: async (parent, args, ctx, info) => {
        const { _id, name, email } = args;
        const { client } = ctx;
        const db = client.db("recipesDatabase");
        const collection = db.collection("authors");

        const author = await collection.findOne({ _id: ObjectID(_id) });
        await collection.findOneAndUpdate({ _id: ObjectID(_id) },
          {$set: { name: name || author.name,
            email: email || author.email}});

        return await collection.findOne({ _id: ObjectID(_id) });
      },
      updateIngredient: async (parent, args, ctx, info) => {
        const { _id, name } = args;
        const { client } = ctx;
        const db = client.db("recipesDatabase");
        const collection = db.collection("ingredients");

        await collection.findOneAndUpdate({ _id: ObjectID(_id) }, {$set: { name: name }});

        return await collection.findOne({ _id: ObjectID(_id) });
      },
      updateRecipe: async (parent, args, ctx, info) => {
        const { _id, title, description, author, ingredients } = args;
        const { client } = ctx;
        const db = client.db("recipesDatabase");
        const collection = db.collection("recipes");

        const recipe = await collection.findOne({ _id: ObjectID(_id) });

        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        await collection.findOneAndUpdate({ _id: ObjectID(_id) },
          {$set: { title: title || recipe.title,
            description: description || recipe.description,
            date: `${day}/${month}/${year}`,
            author: author || recipe.author,
            ingredients: ingredients || recipe.ingredients}});

        return await collection.findOne({ _id: ObjectID(_id) });
      }
    },
    Recipe: {
      author: async (parent, args, ctx, info) => {
        const { client } = ctx;
        const db = client.db("recipesDatabase");
        const collection = db.collection("authors");
        const _id = parent.author;

        return await collection.findOne({ _id: ObjectID(_id) });
      },
      ingredients: async (parent, args, ctx, info) => {
        const { client } = ctx;
        const db = client.db("recipesDatabase");
        const collection = db.collection("ingredients");
        const ingredients = parent.ingredients.map(elem => ObjectID(elem));

        return await collection.find({ _id: { $in: ingredients } }).toArray();
      }
    },
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
