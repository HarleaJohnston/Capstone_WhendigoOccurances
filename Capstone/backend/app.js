const express = require("express");
const session = require("express-session"); 
const cors = require("cors");
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const sanitize = require('sanitize-filename');




const dal = require ("./webDal").DAL;

const port = 3666;

const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.use(
  cors({
    origin: 'http://localhost:3000', 
    credentials: true, 
  })
);


app.use(session({
  secret: "this_is_a_very_secret_key",
  resave: false,
  saveUninitialized: true,
}));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/profile-pictures'); 
  },
  filename: function (req, file, cb) {
    const sanitizedFilename = sanitize(file.originalname); 
    cb(null, sanitizedFilename);
  },
});

const upload = multer({ storage: storage });

app.use(express.static('public'));


app.get("/", (req, res) => {
    res.json({Message: "Welcome to Whendigo Occurances!"})
});

app.get("/post", async (req, res) => {
    let post = await dal.getPost();
    res.json(post);
});

app.get("/post/:id", async (req, res) => {
    let id = req.params.id;
    let post = await dal.getPostById(id);
    res.json(post);
});

app.put('/post/update/:id', async (req, res) => {
    const post = req.body;
    const id = req.params.id;
    const updated = await dal.update(id, post)
    res.json(updated);
  });

app.get("/post/delete/:id", async (req, res) => {
    const id = req.params.id;
  try {
    await dal.delete(id);
    res.json({Message: "Post was deleted"});
  } catch (err) {
    res.json({Message: "Didn't delete"});
  }
});

app.post("/post/create", async (req,res) => {
let post = await dal.create(req.body.postDate, req.body.postBody, req.body.postImg)
return res.json({message: "Post created successfully"});

});

app.put("/user/:id", upload.single('Img'), async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUserData = req.body;
    if (req.file) {
      updatedUserData.Img = `/images/profile-pictures/${req.file.filename}`;
    }

    const updatedUser = await dal.updateUserProfile(userId, updatedUserData);
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post("/post/:id/like", async (req, res) => {
  const postId = req.params.id;
  const userId = req.body.userId; 

  try {
    const post = await dal.likePost(postId, userId);
    res.json({ success: true, post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to like post" });
  }
});

app.post("/post/:id/dislike", async (req, res) => {
  const postId = req.params.id;
  const userId = req.body.userId; 

  try {
    const post = await dal.dislikePost(postId, userId);
    res.json({ success: true, post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to dislike post" });
  }
});

app.post("/post/:id/bookmark", async (req, res) => {
  const userId = req.body.userId;
  const { postId, bookmarked } = req.body;


  try {
    const user = await dal.getUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    if (bookmarked) {
      user.BookMarked.push(postId); 
    } else {
      const index = user.BookMarked.indexOf(postId);
      if (index !== -1) {
        user.BookMarked.splice(index, 1); 
      }
    }

    await user.save();
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to update bookmark" });
  }
});

app.post("/createUser", async (req, res) => {
  const { email, username, password } = req.body;

  try {
    const key = dal.generateKey(); 
    const result = await dal.createUser(email, key, username, password); 
    
    if (result) {
      res.json({ success: true, key: key });
    } else {
      res.json({ success: false, Message: "Failed to create user" });
    }
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ success: false, Message: "An error occurred while creating the user" });
  }
});


app.post("/createKey", async (req, res) => {
  const email = req.body.email;

  try {
    let existingUser = await dal.getUserByEmail(email);

    if (existingUser) {
      res.json({ Message: "User already exists", Key: existingUser.Key });
    } else {
      const key = dal.generateKey();
      let createdUser = await dal.createUser(email, key);

      if (createdUser) {
        res.json({ Message: "User created successfully", Key: key });
      } else {
        res.json({ Message: "Failed to create user" });
      }
    }
  } catch (error) {
    console.error(error);
    res.json({ Message: "An error occurred while registering user" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await dal.getUserByEmail(email);
    if (!user) {
      return res.json({ success: false, Message: "User not found" });
    }

    const isValidPassword = await dal.comparePasswords(password, user.Password);

    if (!isValidPassword) {
      return res.json({ success: false, Message: "Invalid password" });
    }

    const key = dal.generateKey();
    req.session.userId = user._id; 
    res.json({ success: true, key: key, userId: user._id });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ success: false, Message: "An error occurred during login" });
  }
});

app.get("/user/:id", async (req, res) => {
  try {
      let id = req.params.id;
      let user = await dal.getUserById(id);
      res.json(user);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

app.post("/post/:id/comment", async (req, res) => {
  const postId = req.params.id;
  const userId = req.body.userId;
  const userName = req.body.userName; 
  const commentText = req.body.text; 

  try {
    const post = await dal.getPostById(postId);

    if (!post) {
      return res.status(404).json({ success: false, error: "Post not found" });
    }

    const savedComment = await dal.createComment(postId, userId, userName, commentText);

    res.json({ success: true, message: "Comment added successfully", comment: savedComment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to add comment" });
  }
});

app.get("/post/:id/comments", async (req, res) => {
  const postId = req.params.id;

  try {
    const comments = await dal.getCommentsForPost(postId);
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post("/user/:id/friends/:friendId", async (req, res) => {
  const userId = req.params.id;
  const friendId = req.params.friendId;

  try {
    const user = await dal.getUserById(userId);
    const friend = await dal.getUserById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ success: false, error: "User or friend not found" });
    }

    if (!user.Friends.includes(friendId)) {
      user.Friends.push(friendId);
      await user.save();
      res.json({ success: true });
    } else {
      res.json({ success: false, error: "User is already a friend" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to establish friendship" });
  }
});

app.get("/user/:id/friends/:friendId", async (req, res) => {
  const userId = req.params.id;
  const friendId = req.params.friendId;

  try {
    const user = await dal.getUserById(userId);

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const isFriend = user.Friends.includes(friendId);

    res.json({ isFriend });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to check friend status" });
  }
});

app.get("/user/:id/notebook", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await dal.getUserById(userId);
    res.json({ notebookText: user.NoteBook });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get notebook text" });
  }
});


app.put("/user/:id/notebook", async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedNotebook = req.body.notebookText;
    const updatedUser = await dal.updateUserNotebook(userId, updatedNotebook);

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update notebook text" });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await dal.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to fetch users" });
  }
});


app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});