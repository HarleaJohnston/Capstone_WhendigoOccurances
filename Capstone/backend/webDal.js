const { mongoose, Schema } = require("mongoose");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
//const connectionStringz = "mongodb://127.0.0.1:27017/Whendigo_Occurances_DB";
const connectionStringz = "mongodb+srv://quillianrenae:8YDtlJxCKoZrlfgo@cluster0.sv3zblq.mongodb.net/Whendigo_Occurances_DB";
const collectionOne = "Posts"
const collectionTwo = "Users"

mongoose.connect(connectionStringz, {useUnifiedTopology: true, useNewUrlParser: true});

const connection = mongoose.connection;
connection.once("open", () => {
    console.log("Mongoose Connected")
});

const posts = new Schema(
    {
        postDate: String,
        postBody: String,
        postImg: String,
        likes: Array, 
        dislikes: Array,
    },
    { collection: collectionOne}
);

const postModel = mongoose.model("post", posts);

const user = new Schema(
  {
    //_id: Schema.Types.ObjectId,
    Key: String,
    Gmail: String,
    Username: String,
    Bio: String,
    Name: String,
    Img:String,
    Password: String,
    BookMarked: Array,
    NoteBook: String,
    Friends: Array,
  },
  { collection: collectionTwo }
);

const UserModel = mongoose.model("user", user);

const commentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userName: { 
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
});

const commentModel = mongoose.model('Comment', commentSchema);

exports.DAL = {
    //Post Dal Stuff
    create: (postDate, postBody, postImg) => {
        let Posts = {
            postDate: postDate,
            postBody: postBody,
            postImg: postImg,
            dislikes: [], 
            likes: []
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
    likePost: async (postId, userId) => {
      try {
        const updatedPost = await postModel.updateOne(
          { _id: postId },
          { $addToSet: { likes: userId }, $pull: { dislikes: userId } }
        );
        return updatedPost;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    
    dislikePost: async (postId, userId) => {
      try {
        const updatedPost = await postModel.updateOne(
          { _id: postId },
          { $addToSet: { dislikes: userId }, $pull: { likes: userId } }
        );
        return updatedPost;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    bookmarkPost: async (postId, userId, bookmarked) => {
      try {
        const post = await postModel.findById(postId).exec();
        if (!post) {
          throw new Error("Post not found");
        }
    
        if (bookmarked) {
          post.bookmarked.addToSet(userId);
        } else {
          post.bookmarked.pull(userId);
        }
    
        await post.save();
        return post;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },


    //User Dal Stuff
      getUserByEmail: async (email) => {
        return await UserModel.findOne({ Gmail: email }).exec();
      },
      updateUserProfile: async (userId, updatedUserData) => {
        try {
          const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { $set: updatedUserData },
            { new: true }
          ).exec();
          return updatedUser;
        } catch (error) {
          console.error(error);
          throw error;
        }
      },
      updateUserNotebook: async (userId, updatedNotebook) => {
        try {
          const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { $set: { NoteBook: updatedNotebook } },
            { new: true }
          ).exec();
          return updatedUser;
        } catch (error) {
          console.error(error);
          throw error;
        }
      },
      getUserById: async (userId) => {
        try {
          console.log('Fetching user by ID:', userId);
          const user = await UserModel.findById(userId).exec();
          console.log('Fetched user:', user);
          return user;
        } catch (error) {
          console.error(error);
          throw error;
        }
      },
      generateKey: () => {
        return uuidv4();
      },
      createUser: async (email, key, username, password) => {
        let newUser = {
          Key: key,
          Gmail: email,
          Username: username,
          Password: await bcrypt.hash(password, 10),
        };
        console.log('newUser:', newUser);
      
        try {
          const result = await UserModel.create(newUser); 
          return result; 
        } catch (error) {
          console.log("Error creating user:", error);
          throw error;
        }
      },
      bookmarkPost: async (postId, userId, bookmarked) => {
        try {
          const post = await postModel.findById(postId).exec();
          if (!post) {
            throw new Error("Post not found");
          }
      
          if (!post.bookmarked) {
            post.bookmarked = [];
          }
      
          const userIndex = post.bookmarked.indexOf(userId);
          if (bookmarked && userIndex === -1) {
            post.bookmarked.push(userId); 
          } else if (!bookmarked && userIndex !== -1) {
            post.bookmarked.splice(userIndex, 1); 
          }
      
          await post.save();
          return post;
        } catch (error) {
          console.error(error);
          throw error;
        }
      },
      getCommentsForPost: async (postId) => {
        try {
          const comments = await commentModel.find({ postId }).exec();
          return comments;
        } catch (error) {
          console.error(error);
          throw error;
        }
      },
      isKeyValid: (key) => {
        console.log("isKeyValid" + key);
        let result = key === "ndkl-dkfd-ekrg-ewld";
        console.log("isKeyValid result");
        return result;
      },
       comparePasswords: async (inputPassword, hashedPassword) => {
        return await bcrypt.compare(inputPassword, hashedPassword);
      },
      createFriendRequest: async (userId, friendId) => {
        const friendRequest = new FriendRequestModel({
          userId,
          friendId,
        });
        await friendRequest.save();
        return friendRequest;
      },
      getFriendRequest: async (userId, friendId) => {
        try {
          return await FriendRequestModel.findOne({ userId, friendId }).exec();
        } catch (error) {
          console.error(error);
          throw error;
        }
      },
      filename: function (req, file, cb) {
        const sanitizedFilename = sanitize(file.originalname);
        cb(null, sanitizedFilename);
      },

};
