const asyncHandler = require("express-async-handler");
const Posts = require("../models/posts");
const Users = require("../models/users");

exports.index = asyncHandler(async (req, res, next) => {
  const posts = await Posts.find({ published: true }).sort({ date_posted: -1 }).exec();
  res.render("index", {
    posts,
    user: req.user ? await Users.findById(req.user.id).exec() : ""
  });
});

exports.search = asyncHandler(async (req, res, next) => {
  const posts = await Posts.find({
    published: true,
    keywords: { $in: req.params.search.split(" ") }
  })
    .sort({ date_posted: -1 })
    .exec();
  res.render("index", {
    posts,
    user: req.user ? await Users.findById(req.user.id).exec() : ""
  });
});
