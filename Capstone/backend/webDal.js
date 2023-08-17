const { mongoose, Schema } = require("mongoose");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const connectionStringz = "mongodb://127.0.0.1:27017/Whendigo_Occurances_DB";
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
    UserName: String,
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
      bookmarkPost: async (userId, postId) => {
        try {
          const user = await UserModel.findById(userId);
          if (!user) {
            throw new Error("User not found");
          }
      
          if (!user.bookmarkedPosts.includes(postId)) {
            user.bookmarkedPosts.push(postId);
            await user.save();
          }
        } catch (error) {
          console.error(error);
          throw error;
        }
      },
      
      unbookmarkPost: async (userId, postId) => {
        try {
          const user = await UserModel.findById(userId);
          if (!user) {
            throw new Error("User not found");
          }
      
          if (!user.bookmarkedPosts) {
            user.bookmarkedPosts = [];
          }
      
          const index = user.bookmarkedPosts.indexOf(postId);
          if (index !== -1) {
            user.bookmarkedPosts.splice(index, 1);
            await user.save();
          }
        } catch (error) {
          console.error(error);
          throw error;
        }
      },
      createComment: async (postId, userId, userName, text) => {
        try {
          const newComment = new commentModel({
            postId,
            userId,
            userName, 
            text,
          });
      
          const savedComment = await newComment.save();
          return savedComment;
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
      

};
