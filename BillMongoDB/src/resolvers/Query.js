const Query = {
    getBills: async (parent, args, ctx, info) => {
      const { userName, token } = args;
      const { client } = ctx;
      const db = client.db("billDatabase");
      const collectionUsers = db.collection("users");
      const collection = db.collection("bills");

      const findUser = await collectionUsers.findOne({ userName: userName });
      
      if(findUser.token === token){
        return await collection.find({user: findUser._id}).toArray();
      }
      else
        throw new Error("User is not logged in");
    }
}

export {Query as default}