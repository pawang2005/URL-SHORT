const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    shortId: {
      type: String,
      required: true,
      unique: true,
    },
    redirectURL: {
      type: String,
      required: true,
    },

    // 🔗 LINK TO USER
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // must match model name
      required: true,
    },

    visitHistory: [{ timestamp: { type: Number } }],
  },
  { timestamps: true }
);

const URL = mongoose.model("URL", urlSchema);
module.exports = URL;
