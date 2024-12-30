const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { type } = require("express/lib/response.js");
const { ref } = require("joi");

const imageSchema = new Schema({
  filename: { type: String, required: true },
  url: { type: String, required: true }
});

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  category: {
    type: String,
    enum: [
      "mountains", "arctic", "farms", "deserts", 
      "trending", "rooms", "iconic-cities", 
      "castles", "beachfront", "resorts", 
      "lakefront", "boathouse", "amazing-pools"
    ],
    required: true,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    }
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    },
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;