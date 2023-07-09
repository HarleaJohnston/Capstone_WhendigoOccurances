const { mongoose, Schema } = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const connectionStringz = "";
const collectionOne = ""
const collectionTwo = ""

mongoose.connect(connectionStringz, {useUnifiedTopology: true, useNewUrlParser: true});

const connection = mongoose.connection;
connection.once("open", () => {
    console.log("Mongoose Connected")
});

const posts = new Schema(
    {
        postDate: String,
        postBody: String,
        postImg: String
    },
    { collection: collectionOne}
);

const postModel = mongoose.model("post", posts);

const user = new Schema(
    {
        Key: String,
        Gmail: String,
        UserName: String,
        Password: String,
        BookMarked: [String],
        NoteBook: String
    },
    { collection: collectionTwo}
);

const UserModel = mongoose.model("user", user);

exports.DAL = {
    //Post Dal Stuff
    create: (postDate, postBody, postImg) => {
        let Posts = {
            postDate: postDate,
            postBody: postBody,
            postImg: postImg
        }
        postModel.collection.insertOne(Posts);
    },
    delete: async (id) => {
        await postModel.deleteOne({ _id: id }).exec();
        
    },
    update: async (id, data) => {
        try {
            const updatedData = await postModel.findOneAndUpdate({_id: id}, data, {updated: true});
            return updatedData;
        } catch {
            res.json({Message:"couldn't update"})
        }
    },
    getPost: async () => {
        let filter = {};
        return await postModel.find(filter).exec();
    },
    getPostById: async (id) => {
        return await postModel.findById(id).exec();
    },
    //User Dal Stuff
    getUserByEmail: async (email) => {
        return await UserModel.findOne({ Gmail: email }).exec();
      },
      generateKey: () => {
        return uuidv4();
      },
      createUser: async (email, key, username, password) => {
        let newUser = {
          Key: key,
          Gmail: email,
          Username: username,
          Password: password
        };
        let result;
        try {
          result = await UserModel.collection.insertOne(newUser);
        } catch (error) {
          console.log("Error creating user:", error);
          throw error;
        }
        return result;
      },
      isKeyValid: (key) => {
        console.log("isKeyValid" + key);
        let result = key === "ndkl-dkfd-ekrg-ewld";
        console.log("isKeyValid result");
        return result;
      }

};
