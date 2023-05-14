import express from "express";
import bodyParser from "body-parser";
import truncate from "lodash/truncate.js";
import { homeContent, aboutContent, contactContent } from "./content.js";
import mongoose, { Schema } from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect("mongodb+srv://" + process.env.MongoDBAtlas_Username + ":" + process.env.MongoDBAtlas_Password + "@cluster0.zoon73x.mongodb.net/blogpostDB")
};

const postSchema = new Schema({
  title: String,
  content: String
});

const Post = new mongoose.model('Post', postSchema);

app.get('/favicon.ico', (req, res) => res.status(204).end());

app.get("/", (req, res) => {

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

app.get("/about", (req, res) => {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", (req, res) => {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", (req, res) => {
  const title = req.body.newPostTitle;
  const content = req.body.newPostBody;

  Post.create({ title: title, content: content });
  res.redirect("/");
});

app.get("/posts/:postName", (req, res) => {
  const requestedTitle = req.params.postName;

  Post.findOne({ title: requestedTitle })
    .then((foundPost) => {
      const storedTitle = foundPost.title;
      if (storedTitle === requestedTitle) {
        res.render("post", {
          postTitle: foundPost.title,
          postBody: foundPost.content,
        });
      } else {
        res.redirect('/');
      }
    })
    .catch((err) => {
      console.log(err);
    })
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
