const Posts = require("../models/posts");
const Comments = require("../models/comments");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// For posts
exports.create_post_get = (req, res, next) => {
  if (!req.user.admin) {
    res.redirect("/");
    return;
  }
  res.render("post_create", {
    title: "Create Post"
  });
};

exports.create_post_post = [
  body("title", "Title must be specified").trim().isLength({ min: 1 }).escape(),
  body("message", "Message must be specified").trim().isLength({ min: 1 }).escape(),
  asyncHandler(async (req, res, next) => {
    const keys = [req.body.title];
    keys.push(req.body.keywords.split(", "));
    let post = await Posts.findById(req.params.id).exec();
    if (!post) {
      post = new Posts({
        title: req.body.title,
        message: req.body.message,
        date_posted: Date.now(),
        published: req.body.published ? true : false,
        keywords: keys
      });
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.render("post_create");
        return;
      }
    } else {
      post.title = req.body.title;
      post.message = req.body.message;
      post.date_edited = Date.now();
      post.published = req.body.published ? true : false;
      post.keywords = keys;
    }
    await post.save();
    if (post.published) {
      res.redirect("/");
    } else {
      res.redirect("/unpublished");
    }
    return;
  })
];

// For viewed posts
exports.post_get = asyncHandler(async (req, res, next) => {
  const [post, comments] = await Promise.all([
    Posts.findById(req.params.id).exec(),
    Comments.find({ post: req.params.id }).populate("user").exec()
  ]);
  res.render("post", {
    post,
    comments,
    user: req.user ? req.user : ""
  });
});

exports.post_delete = asyncHandler(async (req, res, next) => {
  await Comments.deleteMany({ post: req.params.id }).exec();
  await Posts.findByIdAndDelete(req.params.id).exec();
  // MUST be json because it uses the browser NOT server
  res.json({ redirect: "/" });
});

// For Comments
exports.create_comment_post = [
  body("comment", "Comment must be specified").trim().isLength({ min: 1 }).escape(),
  asyncHandler(async (req, res, next) => {
    const comment = new Comments({
      user: req.user.id,
      post: req.params.id,
      comment: req.body.comment
    });
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const [post, comments] = await Promise.all([
        Posts.findById(req.params.id).exec(),
        Comments.find({ post: req.params.id }).populate("user").exec()
      ]);
      res.render("post", {
        post,
        comments,
        user: req.user ? req.user : ""
      });
      return;
    } else {
      await comment.save();
      res.redirect(`/post/${comment.post}`);
    }
  })
];

exports.comment_delete = asyncHandler(async (req, res, next) => {
  const [post, comment] = await Promise.all([
    Posts.findById(req.params.id).exec(),
    Comments.findById(req.params.commentId).exec()
  ]);
  comment.deleted = true;
  comment.comment = "Deleted Comment";
  await comment.save();
  res.json({ redirect: `/post/${post.id}` });
});

// For unpublished posts
exports.unpublished_posts_list_get = asyncHandler(async (req, res, next) => {
  if (!req.user || !req.user.admin) {
    res.redirect("/");
    return;
  }
  const posts = await Posts.find({ published: false }).sort({ date_posted: -1 }).exec();
  res.render("unpublished_posts", {
    posts
  });
});

exports.edit_unpublished_post_get = asyncHandler(async (req, res, next) => {
  if (!req.user || !req.user.admin) {
    res.redirect("/");
    return;
  }
  const post = await Posts.findById(req.params.id);
  res.render("post_create", {
    title: "Edit Post",
    post
  });
});

exports.unpublished_post_delete = asyncHandler(async (req, res, next) => {
  const posts = Posts.findById(req.params.id).exec();
  await Posts.findByIdAndDelete(req.params.id).exec();
  if (posts.published === false) {
    res.json({ redirect: "/unpublished" });
  } else {
    res.json({ redirect: "/" });
  }
});

exports.unpublished_post_search = asyncHandler(async (req, res, next) => {
  const posts = await Posts.find({ published: false, title: req.params.search })
    .sort({ date_posted: -1 })
    .exec();
  res.render("unpublished_posts", {
    posts
  });
});

// For editing published posts
exports.edit_published_post_get = asyncHandler(async (req, res, next) => {
  if (!req.user || !req.user.admin) {
    res.redirect("/");
    return;
  }
  const post = await Posts.findById(req.params.id).exec();
  res.render("post_create", {
    title: "Edit Post",
    post
  });
});

exports.edit_published_post_post = asyncHandler(async (req, res, next) => {
  const post = await Posts.findById(req.params.id).exec();
  post.title = req.body.title;
  post.message = req.body.message;
  post.published = req.body.published ? true : false;
  post.edited = Date.now();
  await post.save();
  if (post.published) {
    res.redirect("/");
  } else {
    res.redirect("/unpublished");
  }
});
