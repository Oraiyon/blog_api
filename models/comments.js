const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "users", required: true },
  post: { type: Schema.Types.ObjectId, ref: "posts", required: true },
  comment: { type: String, required: true },
  date_posted: { type: Date, default: Date.now },
  deleted: { type: Boolean, default: false }
});

CommentSchema.virtual("date_posted_formatted").get(function () {
  return DateTime.fromJSDate(this.date_posted).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model("comments", CommentSchema);
