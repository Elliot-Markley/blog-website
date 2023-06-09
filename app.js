// Import the required modules
import express from "express";
import bodyParser from "body-parser";
import truncate from "lodash/truncate.js";
import { homeContent, aboutContent, contactContent } from "./content.js";
import mongoose, { Schema } from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

// Create a new express app
const app = express();

// Set the view engine to ejs
app.set('view engine', 'ejs');

// Use body-parser and the public folder
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Connect to the MongoDB Atlas database
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect("mongodb+srv://" + process.env.MongoDBAtlas_Username + ":" + process.env.MongoDBAtlas_Password + "@cluster0.zoon73x.mongodb.net/blogpostDB")
};

// Create a schema for the posts
const postSchema = new Schema({
  title: String,
  content: String
});

// Create a model for the posts
const Post = new mongoose.model('Post', postSchema);

// Ignore the favicon.ico request
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Render the home page
// This route is used to view all the posts
app.get("/", (req, res) => {
  // Find all the posts in the database
  Post.find()
    .then((foundPosts) => {
      res.render("home", {
        homeContent: homeContent,
        posts: foundPosts,
        truncate: truncate
      });
    })
    .catch((err) => {
      console.log(err);
    })
});

// Render the about page
app.get("/about", (req, res) => {
  res.render("about", { aboutContent: aboutContent });
});

// Render the contact page
app.get("/contact", (req, res) => {
  res.render("contact", { contactContent: contactContent });
});

// Render the compose page
// This route is used to create a new post
app.route("/compose")
  .get((req, res) => {
    res.render("compose");
  })
  // Create a new post
  .post((req, res) => {
    const title = req.body.newPostTitle;
    const content = req.body.newPostBody;

    Post.create({ title: title, content: content });
    res.redirect("/compose");
  });

// Render the delete page
// This route is used to delete a post
app.route("/delete")
  // Find all the posts in the database
  .get((req, res) => {
    Post.find()
      .then((foundPosts) => {
        res.render("delete", {
          homeContent: homeContent,
          posts: foundPosts,
          truncate: truncate
        });
      })
      .catch((err) => {
        console.log(err);
      });
  })
  // Delete the requested post
  .post((req, res) => {
    Post.findOneAndRemove()
      .then(() => {
        res.redirect("/delete");
      })
      .catch((err) => {
        console.log(err);
      });
  });

// Render the requested post
// This route is used to view a post
app.post("/posts/:postId", (req, res) => {
  const requestedPostId = req.params.postId;

  Post.findById(requestedPostId)
    .then((foundPost) => {
      res.render("post", {
        postTitle: foundPost.title,
        postBody: foundPost.content,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

// Start the server on port 3000
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
