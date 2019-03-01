const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
  {
    author: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    upVotes: {
      type: Number,
      default: 0
    },
    downVotes: {
      type: Number,
      default: 0
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment"
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
