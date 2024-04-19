const express = require("express");
const router = express.Router();

const blogController = require("../controllers/blogController");
const loginController = require("../controllers/loginController");
const signupController = require("../controllers/signupController");
const postsController = require("../controllers/postsController");

// For home page
router.get("/", blogController.index);
router.get("/search/:search", blogController.search);

// For login/ logout
router.get("/login", loginController.login_get);
router.post("/login", loginController.login_post);
router.get("/logout", loginController.logout);

// For sign up
router.get("/signup", signupController.signup_get);
router.post("/signup", signupController.signup_post);

// For posts
router.get("/create", postsController.create_post_get);
router.post("/create", postsController.create_post_post);
router.get("/post/:id", postsController.post_get);
router.delete("/post/:id", postsController.post_delete);
router.get("/post/:id/edit", postsController.edit_published_post_get);
router.post("/post/:id/edit", postsController.edit_published_post_post);

// For unpublished posts
router.get("/unpublished", postsController.unpublished_posts_list_get);
router.get("/unpublished/:id", postsController.edit_unpublished_post_get);
router.post("/unpublished/:id", postsController.create_post_post);
router.delete("/unpublished/:id", postsController.unpublished_post_delete);
router.get("/unpublished/search/:search", postsController.unpublished_post_search);

// For comments
router.post("/post/:id", postsController.create_comment_post);
router.delete("/post/:id/:commentId", postsController.comment_delete);

module.exports = router;
