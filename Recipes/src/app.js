import {GraphQLServer} from 'graphql-yoga'
import * as uuid from 'uuid'

const recipeData = [];
const authorData = [];
const ingredientData = [];

const typeDefs = `
    type Recipe {
        title: String!
        description: String!
        date: String!
        author: Author!
        ingredients: [Ingredient!]!
        id: ID!
    }

    type Author {
        name: String!
        email: String!
        recipes: [Recipe!]!
        id: ID!
    }

    type Ingredient {
        name: String!
        recipes: [Recipe!]!
        id: ID!
    }

    type Query {
        recipeList: [Recipe!]!
        authorList: [Author!]!
        ingredientList: [Ingredient!]!
    }

    type Mutation {
        addRecipe(title: String!, description: String!, author: ID!, ingredients: [ID!]!): Recipe!
        addAuthor(name: String!, email: String!): Author!
        addIngredient(name: String!): Ingredient!
    }
`

const resolvers = {
    Recipe: {
        author: (parent, args, ctx, info) => {
            const authorID = parent.author;
            const result = authorData.find(obj => obj.id === authorID);
            return result;
        },
        
        ingredients: (parent, args, ctx, info) => {
            const result = parent.ingredients.map(element => {
                const ingredientInfo = ingredientData.find(obj => obj.id === element);
                return {
                    name: ingredientInfo.name,
                    id: ingredientInfo.id
                }
            })
            return result;
        }
    },

    Author: {
        recipes: (parent, args, ctx, info) => {
            const authorID = parent.id;
            return recipeData.filter(obj => obj.author === authorID);
        }
    },

    Ingredient: {
        recipes: (parent, args, ctx, info) => {
            const result = parent.recipes.map(element => {
                const recipeInfo = recipeData.find(obj => obj.id === element);
                return {
                    title: recipeInfo.title,
                    id: recipeInfo.id,
                    description: recipeInfo.description,
                    date: recipeInfo.date,
                    ingredients: recipeInfo.ingredients
                }
            })
            return result;
        }
    },

    Query: {
        recipeList: () => {
            return recipeData.map(elem => {
                return elem;
            })
        },

        authorList: () => {
            return authorData.map(elem => {
                return elem;
            })
        },

        ingredientList: () => {
            return ingredientData.map(elem => {
                return elem;
            })
        }
    },

    Mutation: {
        addRecipe: (parent, args, ctx, info) => {
            const {title, description, author, ingredients} = args;
            if (recipeData.some(obj => obj.title === title)){
                throw new Error(`${title} recipe already exist`);
            }

            const date = new Date().getDate();
            const id = uuid.v4();

            const recipe = {
                title,
                description,
                date,
                author,
                ingredients,
                id
            }

            const authorObject = authorData.find(obj => obj.id === author);
            authorObject.recipes.push(id);
            ingredients.map(element => {
                const ingredientInfo = ingredientData.find(obj => obj.id === element);
                ingredientInfo.recipes.push(id);
            })

            recipeData.push(recipe);
            return recipe;
        },
        
        addAuthor: (parent, args, ctx, info) => {
            const {name, email} = args;
            if (authorData.some(obj => obj.email === email)){
                throw new Error(`User email ${email} already in use`);
            }

            const recipes = [];

            const author = {
                name,
                email,
                recipes,
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

            const recipes = [];

            const ingredient = {
                name,
                recipes,
                id: uuid.v4()
            }

            ingredientData.push(ingredient);
            return ingredient;
        }
    }
}

const server = new GraphQLServer({typeDefs, resolvers});
server.start(() => console.log("Server started"));