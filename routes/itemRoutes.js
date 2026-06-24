const express = require("express");

const router = express.Router();

const Item = require("../models/Item");

// ADD ITEM
router.post("/", async (req, res) => {

  try {

    const newItem = new Item({

      title: req.body.title,

      category: req.body.category,

      description: req.body.description,

      location: req.body.location,

      image: req.body.image,

      secretMark: req.body.secretMark,

    });

    await newItem.save();

    res.status(201).json({
      success: true,
      message: "Item added successfully",
      item: newItem,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Error adding item",
    });
  }
});

// TOTAL ITEM STATISTICS
router.get("/count", async (req, res) => {

  try {

    const totalItems =
      await Item.countDocuments();

    const claimedItems =
      await Item.countDocuments({
        isClaimed: true,
      });

    const unclaimedItems =
      await Item.countDocuments({
        isClaimed: false,
      });

    res.json({

      totalItems,

      claimedItems,

      unclaimedItems,

    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
});

// CATEGORY STATISTICS
router.get("/categories", async (req, res) => {

  try {

    const data = await Item.aggregate([

      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },

    ]);

    res.json(data);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
});

// GET ALL ITEMS
router.get("/", async (req, res) => {

  try {

    const items = await Item.find()
      .sort({ reportedAt: -1 });

    res.json(items);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Error fetching items",
    });
  }
});

// GET SINGLE ITEM
router.get("/:id", async (req, res) => {

  try {

    const item = await Item.findById(
      req.params.id
    );

    if (!item) {

      return res.status(404).json({
        message: "Item not found",
      });

    }

    res.json(item);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;