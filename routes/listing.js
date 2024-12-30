const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner } = require("../middleware.js");

const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// Route to filter listings


router.get(
  "/filter",
  wrapAsync(async (req, res) => {
    const { price, location } = req.query;

    // Build filter criteria based on query parameters
    let filterCriteria = {};
    if (price) {
      filterCriteria.price = { $lte: price }; // Example: listings with price less than or equal to the provided price
    }
    if (location) {
      filterCriteria.location = { $regex: location, $options: "i" }; // Case-insensitive match for location
    }

    const filteredListings = await Listing.find(filterCriteria);
    res.render("listings/filter.ejs", { listings: filteredListings, query: req.query });
  })
);

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    wrapAsync(listingController.createNewListing)
  );

// Route for rendering new listing form
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    upload.single("listing[image]"),
    isOwner,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing));

module.exports = router;


