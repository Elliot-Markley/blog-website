//jshint esversion:6

import express from "express";
import bodyParser from "body-parser";
import kebabCase from "lodash/kebabCase.js";
import truncate from "lodash/truncate.js";
import { homeContent, aboutContent, contactContent } from "./content.js";

import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let posts = [];

// Home Route

app.get("/", (req, res) => {
  res.render("home", {
    homeContent: homeContent,
    posts: posts,
    truncate: truncate,
  });
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
