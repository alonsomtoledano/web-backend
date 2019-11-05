import {GraphQLServer} from 'graphql-yoga'
import * as uuid from 'uuid'

const recipeData = [];
const authorData = [{
    name: "Alonso",
    email: "alonso@gmail.com",
    id: 123456789
}];
const ingredientData = [{
    name: "Zanahoria",
    id: 1
}];

const typeDefs = `
    type Recipe {
        title: String!
        description: String!
        date: Int!
        author: ID!
        id: ID!
    }

    type Author {
        name: String!
        email: String!
        id: ID!
    }

    type Ingredient {
        name: String!
        id: ID!
    }

    type Query {
        recipeList: [Recipe!]
        authorList: [Author!]
        ingredientList: [Ingredient!]
    }

    type Mutation {
        addRecipe(title: String!, description: String!, author: ID!): Recipe!
        addAuthor(name: String!, email: String!): Author!
        addIngredient(name: String!): Ingredient!
    }
`

const resolvers = {
    Query: {
        recipeList: () => {
            return recipeData;
        },

        authorList: () => {
            return authorData;
        },

        ingredientList: () => {
            return ingredientData;
        }
    },

    Mutation: {
        addRecipe: (parent, args, ctx, info) => {
            const {title, description, author} = args;
            if (recipeData.some(obj => obj.title === title)){
                throw new Error(`${title} recipe already exist`);
            }

            const recipe = {
                title,
                description,
                date: 1234,
                author,
                id: uuid.v4()
            }

            recipeData.push(recipe);
            return recipe;
        },
        
        addAuthor: (parent, args, ctx, info) => {
            const {name, email} = args;
            if (authorData.some(obj => obj.email === email)){
                throw new Error(`User email ${email} already in use`);
            }

            const author = {
                name,
                email,
                id: uuid.v4()
            }

            authorData.push(author);
            return author;
        },

        addIngredient: (parent, args, ctx, info) => {
            const {name} = args;
            if (ingredientData.some(obj => obj.name === name)){
                throw new Error(`${name} ingredient already exist`);
            }

            const ingredient = {
                name,
                id: uuid.v4()
            }

            ingredientData.push(ingredient);
            return ingredient;
        }
    }
}

const server = new GraphQLServer({typeDefs, resolvers});
server.start(() => console.log("Server started"));