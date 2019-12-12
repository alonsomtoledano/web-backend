import { ObjectID } from "mongodb";

const Mutation = {
    addTeam: async (parent, args, ctx, info) => {
        const { name } = args;
        const { client } = ctx;

        const db = client.db("footballDatabase");
        const collection = db.collection("teams");

        const findTeam = await collection.findOne({ name });

        if (!findTeam){
            const result = await collection.insertOne({ name });
    
            return result.ops[0];
        }
        else throw new Error("Team already exist");
    },
    addMatch: async (parent, args, ctx, info) => {
        const { teams, date } = args;
        const { client } = ctx;

        const db = client.db("footballDatabase");
        const collection = db.collection("matches");

        const result = await collection.insertOne({ teams, date, scoreboard: "0-0", in_game: false, ended: false });

        return result.ops[0];
    },
    beginMatch: async (parent, args, ctx, info) => {
        const { match } = args;
        const { client } = ctx;

        const db = client.db("footballDatabase");
        const collection = db.collection("matches");

        const findMatch = await collection.findOne({ $and: [{ _id: ObjectID(match)}, {in_game: false }] });

        if(findMatch){
            const result = await collection.findOneAndUpdate(
                {_id: ObjectID(match)},
                {$set: {in_game: true}},
                {returnOriginal:false}
            );
            return result.value;
        }
        else throw new Error("Match does not exist or has not begun");
    },
    endMatch: async (parent, args, ctx, info) => {
        const { match } = args;
        const { client } = ctx;

        const db = client.db("footballDatabase");
        const collection = db.collection("matches");

        const findMatch = await collection.findOne({ $and: [{ _id: ObjectID(match)}, {in_game: true }] });

        if(findMatch){
            const result = await collection.findOneAndUpdate(
                {_id: ObjectID(match)},
                {$set: {in_game: false, ended: true}},
                {returnOriginal:false}
            );
            return result.value;
        }
        else throw new Error("Match does not exist or is not playing");
    },
    updateScoreboard: async (parent, args, ctx, info) => {
        const { match, scoreboard } = args;
        const { client } = ctx;

        const db = client.db("footballDatabase");
        const collection = db.collection("matches");

        const findMatch = await collection.findOne({ $and: [{ _id: ObjectID(match)}, {in_game: true }] });

        if(findMatch){
            const result = await collection.findOneAndUpdate(
                {_id: ObjectID(match)},
                {$set: {scoreboard}},
                {returnOriginal:false}
            );
            return result.value;
        }
        else throw new Error("Match does not exist or is not playing");
    },
    tellyou: (parent, args, ctx, info) => {
        const {id, value} = args;
        const {pubsub} = ctx;
        pubsub.publish(
            id,
            {
                tellme: value
            }
        );
        return value;
    },
}

export {Mutation as default}