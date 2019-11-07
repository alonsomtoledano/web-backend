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
        ingredients: [Ingredient]!
        id: ID!
    }

    type Author {
        name: String!
        email: String!
        recipes: [Recipe]!
        id: ID!
    }

    type Ingredient {
        name: String!
        recipes: [Recipe]!
        id: ID!
    }

    type Query {
        recipeList: [Recipe]!
        authorList: [Author]!
        ingredientList: [Ingredient]!
        authorRecipes(id: ID!): [Recipe]!
        ingredientRecipes(id: ID!): [Recipe]!
    }

    type Mutation {
        addRecipe(title: String!, description: String!, author: ID!, ingredients: [ID!]!): Recipe!
        addAuthor(name: String!, email: String!): Author!
        addIngredient(name: String!): Ingredient!
        removeRecipe(id: ID!): String!
        removeAuthor(id: ID!): String!
        updateAuthor(id: ID!, name: String!, email: String!): Author!
        updateRecipe(id: ID!, title: String!, description: String!, author: ID!, ingredients: [ID]!): Recipe!
        updateIngredient(id: ID!, name: String!): Ingredient!
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
            const result = parent.ingredients.map(elem => {
                const ingredientInfo = ingredientData.find(obj => obj.id === elem);
                return ingredientInfo;
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
            const result = parent.recipes.map(elem => {
                const recipeInfo = recipeData.find(obj => obj.id === elem);
                return recipeInfo;
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
        },

        authorRecipes: (parent, args, ctx, info) => {
            const {id} = args;
            if (!authorData.some(obj => obj.id === id)){
                throw new Error(`User ${id} does not exist`);
            }

            const authorObject = authorData.find(obj => obj.id === id);

            const result = authorObject.recipes.map(elem => {
                const result = recipeData.find(recipe => recipe.id === elem);
                return result;
            })
            return result;
        },

        ingredientRecipes: (parent, args, ctx, info) => {
            const {id} = args;
            if (!ingredientData.some(obj => obj.id === id)){
                throw new Error(`Ingredient ${id} does not exist`);
            }

            const ingredientObject = ingredientData.find(obj => obj.id === id);

            const result = ingredientObject.recipes.map(elem => {
                const result = recipeData.find(recipe => recipe.id === elem);
                return result;
            })
            return result;
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
            ingredients.map(elem => {
                const ingredientInfo = ingredientData.find(obj => obj.id === elem);
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
        },

        removeRecipe: (parent, args, ctx, info) => {
            const {id} = args;
            if (!recipeData.some(obj => obj.id === id)){
                throw new Error(`${id} recipe does not exist`);
            }

            const recipeObject = recipeData.find(obj => obj.id === id);
            
            recipeData.splice(recipeData.indexOf(recipeObject), 1);

            return `Recipe removed`;
        },

        removeAuthor: (parent, args, ctx, info) => {
            const {id} = args;
            if (!authorData.some(obj => obj.id === id)){
                throw new Error(`${id} author does not exist`);
            }

            const authorObject = authorData.find(obj => obj.id === id);

            authorData.splice(authorData.indexOf(authorObject), 1);

            const recipeObject = recipeData.find(obj => obj.author === id);
            
            if(recipeObject){
                recipeData.splice(recipeData.indexOf(recipeObject), 1);
            }

            return `Author removed`;
        },

        updateAuthor: (parent, args, ctx, info) => {
            const {id, name, email} = args;
            if (!authorData.some(obj => obj.id === id)){
                throw new Error(`${id} author does not exist`);
            }

            const authorObject = authorData.find(obj => obj.id === id);

            authorObject.name = name;
            authorObject.email = email;

            return authorObject;
        },

        updateRecipe: (parent, args, ctx, info) => {
            const {id, title, description, author, ingredients} = args;
            if (!recipeData.some(obj => obj.id === id)){
                throw new Error(`${id} recipe does not exist`);
            }

            const recipeObject = recipeData.find(obj => obj.id === id);
 
            recipeObject.title = title;
            recipeObject.description = description;
            recipeObject.author = author;
            recipeObject.ingredients = ingredients;

            return recipeObject;
        },

        updateIngredient: (parent, args, ctx, info) => {
            const {id, name} = args;
            if (!ingredientData.some(obj => obj.id === id)){
                throw new Error(`${id} ingredient does not exist`);
            }

            const ingredientObject = ingredientData.find(obj => obj.id === id);

            ingredientObject.name = name;

            return ingredientObject;
        }
    }
}

const server = new GraphQLServer({typeDefs, resolvers});
server.start(() => console.log("Server started"));