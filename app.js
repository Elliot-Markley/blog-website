//jshint esversion:6

import express from "express";
import bodyParser from "body-parser";
import kebabCase from "lodash/kebabCase.js";
import truncate from "lodash/truncate.js";
import { homeContent, aboutContent, contactContent } from "./content.js";
import mongoose, { Schema } from "mongoose";
import dotenv from 'dotenv';
dotenv.config();


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Connect to MongoDB Atlas

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect("mongodb+srv://" + process.env.MongoDBAtlas_Username + ":" + process.env.MongoDBAtlas_Password + "@cluster0.zoon73x.mongodb.net/blogpostDB")
};

const postSchema = new Schema({
  title: String,
  content: String
});

const Post = new mongoose.model('Post', postSchema);

// Favicon added to DB fix

app.get('/favicon.ico', (req, res) => res.status(204).end());

// Home Route

app.get("/", (req, res) => {

  Post.find()
    .then((foundPosts) => {
      res.render("home", {
        homeContent: homeContent,
        posts: foundPosts,
        truncate: truncate,
      });
    })
    .catch((err) => {
      console.log(err);
    })

});

// About Route

app.get("/about", (req, res) => {
  res.render("about", { aboutContent: aboutContent });
});

// Contact Route

app.get("/contact", (req, res) => {
  res.render("contact", { contactContent: contactContent });
});

// Compose Route

app.get("/compose", (req, res) => {
  res.render("compose");
});

// Store value's from text box's on compose page into an object named post
// Push post obect into array named posts
// Redirect to home page

app.post("/compose", (req, res) => {
  const post = {
    postTitle: req.body.newPostTitle,
    postBody: req.body.newPostBody,
  };
  posts.push(post);
  res.redirect("/");
});

// Dynamically render each post to the Post page

app.get("/posts/:postName", (req, res) => {
  const requestedTitle = kebabCase(req.params.postName);

  posts.forEach(post => {
    const storedTitle = post.postTitle;
    if (kebabCase(storedTitle) === requestedTitle) {
      res.render("post", {
        postTitle: storedTitle,
        postBody: post.postBody,
      });
    };
  });
});
// Start server

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
