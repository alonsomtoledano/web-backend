const Mutation = {
    addUser: async (parent, args, ctx, info) => {
      const { userName, password } = args;
      const { client } = ctx;

      const db = client.db("billDatabase");
      const collection = db.collection("users");
      
      const findUser = await collection.findOne({ userName: userName });
      if (!findUser){
        const result = await collection.insertOne({ userName, password });

        return {
          _id: result.ops[0]._id,
          userName,
          password
        }
      }
      else
        throw new Error("User already exist");
    },
    login: async (parent, args, ctx, info) => {
      const { userName, password } = args;
      const { client } = ctx;

      const db = client.db("billDatabase");
      const collection = db.collection("users");

      const findUser = await collection.findOne({ userName: userName });
      if(findUser.password === password){
        const token = uuid.v4();

        await collection.findOneAndUpdate({ userName: userName},
          {$set: {token: token}});
        
        return token;
      }
      else
        throw new Error("Wrong UserName or Password");
    },
    logout: async (parent, args, ctx, info) => {
      const { userName, token } = args;
      const { client } = ctx;

      const db = client.db("billDatabase");
      const collection = db.collection("users");

      const findUser = await collection.findOne({ userName: userName });
      if(findUser.token === token){
        await collection.findOneAndUpdate({ userName: userName},
          {$set: {token: null}});

        return await collection.findOne({ userName: userName });
      }
      else
        throw new Error("User is not logged in");
    },
    addBill: async (parent, args, ctx, info) => {
      const { userName, token, concept, amount } = args;
      const { client } = ctx;

      const date = new Date();
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      const db = client.db("billDatabase");
      const collectionUsers = db.collection("users");
      const collection = db.collection("bills");

      const findUser = await collectionUsers.findOne({ userName: userName });
      const userID = findUser._id;
      if(findUser.token === token){
        const result = await collection.insertOne({ date: `${day}/${month}/${year}`, concept, amount, user: userID });

        return {
          _id: result.ops[0]._id,
          date,
          concept,
          amount,
          user: userID
        }
      }
      else
        throw new Error("User is not logged in");
    },
    removeUser: async (parent, args, ctx, info) => {
      const { userName, token } = args;
      const { client } = ctx;
      const db = client.db("billDatabase");
      const collectionUsers = db.collection("users");
      const collection = db.collection("bills");

      const findUser = await collectionUsers.findOne({ userName: userName });
      
      if(findUser.token === token){
        await collectionUsers.findOneAndDelete({ _id: ObjectID(findUser._id) });

        const findBills = await collection.findOne({ user: findUser._id });

        while(findBills){
          await collection.findOneAndDelete({ user: findUser._id });
          findBills = await collection.findOne({ user: findUser._id });
        }

        return findUser;
      }
      else
        throw new Error("User is not logged in");
    }
}

export {Mutation as default}