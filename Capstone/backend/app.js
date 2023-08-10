const express = require("express");
const session = require("express-session"); 
const cors = require("cors");
const { v4: uuidv4 } = require('uuid');

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
  const postId = req.params.id;
  const userId = req.body.userId;
  const bookmarked = req.body.bookmarked;

  try {
    const post = await dal.bookmarkPost(postId, userId, bookmarked);
    res.json({ success: true, bookmarked: post.bookmarked });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to bookmark post" });
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
    req.session.userId = user._id; // Store the user ID in the session
    res.json({ success: true, key: key, userId: user._id });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ success: false, Message: "An error occurred during login" });
  }
});

app.get('/getUserData', async (req, res) => {
  try {
    const userId = req.session.userId;
    console.log('Fetching user data for userId:', userId);
    const user = await dal.getUserById(userId);
    console.log('Fetched user data:', user);
    res.json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post("/post/:id/comment", async (req, res) => {
  const postId = req.params.id;
  const userId = req.body.userId;
  const commentText = req.body.comment;

  try {
    const post = await dal.getPostById(postId);

    if (!post) {
      return res.status(404).json({ success: false, error: "Post not found" });
    }

    const newComment = new commentModel({
      postId: post._id,
      userId: userId,
      text: commentText,
    });

    await newComment.save();

    res.json({ success: true, message: "Comment added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to add comment" });
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});