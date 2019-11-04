import {GraphQLServer} from 'graphql-yoga'
import * as uuid from 'uuid'

const authorData = [];
const postsData = [{
    id: 1,
    title: "Un post",
    body: "Buenas",
    author: "d58637b6-bdad-4259-bbde-6a27ea8ab3d4",
    date: 123456789,
    comments: []
}];
const commentsData = [];

const typeDefs = `
    type Author {
        name: String!
        email: String!
        id: ID!
        posts: [Post!]
    }

    type Comment{
        body: String!
        date: Int!
        id: ID!
        author: Author!
    }

    type Post {
        title: String!
        body: String!
        date: String!
        author: Author!
        comments: [Comment!]
        id: ID!
    }

    type Query{
        author(id: ID!): Author
        post(id: ID!): Post
    }

    type Mutation {
        addAuthor(name: String!, email: String!): Author!
        addPost(title: String!, body: String!, author: ID!): Post!
    }
`

const resolvers = {
    Author: { 
        posts: (parents, args, ctx, info) => {
            const authorID = parent.id;
            return postsData.filter(obj => obj.author === authorID);
        }
    },

    Post: { //Cuando retorne un post
        author: (parents, args, ctx, info) => { //El campo author es filtrado
            const authorID = parent.author; //El result esta en parent
            const result = authorData.find(obj => obj.id === authorID);
            return result;
        }
    },

    Query: {
        author: (parent, args, ctx, info) => {
            const result = authorData.find(obj => obj.id === args.id);
            return result;
        },

        post: (parent, args, ctx, info) => {
            if(!postsData.some(onj = obj.id === args.id)){
                throw new Error(`Unknown poat with id ${args.id}`);
            }
            const result = postData.find(obj => obj.id === args.id);
            return result;
        }
    },

    Mutation: {
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

        addPost: (parent, args, ctx, info) => {
            const {title, body, author} = args;

            if(!authorData.some(obj => obj.id === author)) throw new Error(`Author ${author} not found`);

            const date = new Date().getDate();
            const id = uuid.v4();

            const post = {
                title, body, author, fate, id
            };

            postData.push(post);
            return post;
        }
    }
}

const server = new GraphQLServer({typeDefs, resolvers});
server.start(() => console.log("Server started"));