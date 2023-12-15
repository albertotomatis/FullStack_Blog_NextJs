import mongoose, { Schema, models } from "mongoose";

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User", // Riferimento al modello degli utenti
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["nextjs", "mongoDB", "react", "tailwind"],
      required: true,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    imageUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Post = models.Post || mongoose.model("Post", postSchema);
export default Post;
