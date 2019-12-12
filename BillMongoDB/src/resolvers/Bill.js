const Bill = {
    user: async (parent, args, ctx, info) => {
      const { client } = ctx;
      const db = client.db("billDatabase");
      const collection = db.collection("users");
      const _id = parent.user;

      return await collection.findOne({ _id: ObjectID(_id) });
    }
}

export {Bill as default}