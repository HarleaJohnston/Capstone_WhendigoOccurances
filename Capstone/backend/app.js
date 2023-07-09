const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require('uuid');

const dal = require ("./webDal").DAL;

const port = 666;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

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
    res.json({Message: "item was deleted"});
  } catch (err) {
    res.json({Message: "Didn't delete"});
  }
});

app.post("/post/create", async (req,res) => {
let post = await dal.create(req.body.postDate, req.body.postBody, req.body.postImg)
return res.json({message: "Post created successfully"});

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

app.post("/userExists", async (req, res) => {
  const { email, key } = req.body;

  try {
    const user = await dal.getUserByEmail(email);

    if (user && user.Key === key) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    console.error('Error checking credentials:', error);
    res.json({ success: false });
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});