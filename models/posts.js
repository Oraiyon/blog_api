const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  date_posted: { type: Date, required: true },
  published: { type: Boolean, required: true },
  date_edited: { type: Date, default: Date.now },
  keywords: { type: Array, required: true }
});

PostSchema.virtual("date_posted_formatted").get(function () {
  return DateTime.fromJSDate(this.date_posted).toLocaleString(DateTime.DATE_MED);
});

PostSchema.virtual("date_edited_formatted").get(function () {
  return DateTime.fromJSDate(this.date_edited).toLocaleString(DateTime.DATE_MED);
});

PostSchema.virtual("url").get(function () {
  return `/post/${this._id}`;
});

module.exports = mongoose.model("posts", PostSchema);
