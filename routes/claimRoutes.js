const express = require("express");
const router = express.Router();

const Claim = require("../models/Claim");
const Item = require("../models/Item");
const analyzeClaim = require("../utils/gemini");

router.post("/", async (req, res) => {

  try {

    const item = await Item.findById(
      req.body.itemId
    );

    let score = 0;
let recommendation = "Needs Verification";
let aiReason = "AI analysis not available.";

if (item) {

  try {

    const aiResult = await analyzeClaim(item, req.body);

    score = aiResult.score;
    recommendation = aiResult.recommendation;
    aiReason = aiResult.reason;

  } catch (error) {

    console.log("Gemini Error:", error);

  }

}

    const claim =
      await Claim.create({

        itemId: req.body.itemId,

        name: req.body.name,

        contact: req.body.contact,

        studentId:
          req.body.studentId,

        department:
          req.body.department,

        reason: req.body.reason,

        claimantProof:
          req.body.claimantProof,

        aiScore: score,

        aiRecommendation:
          recommendation,

        aiReason: aiReason,

      });

    res.status(201).json({
      success: true,
      claim,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

});

router.get("/", async (req, res) => {

  try {

    const claims =
      await Claim.find();

    const result = [];

    for (const claim of claims) {

      const item =
        await Item.findById(
          claim.itemId
        );

      result.push({

        ...claim._doc,

        itemTitle:
          item?.title ||
          "Deleted Item",

        itemLocation:
          item?.location || "-",

        itemDescription:
          item?.description || "-",

        itemSecretMark:
          item?.secretMark || "-",

      });

    }

    res.json(result);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

});

router.get("/:itemId", async (req, res) => {

  try {

    const claims =
      await Claim.find({
        itemId:
          req.params.itemId,
      });

    res.json(claims);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

});

router.put("/:id", async (req, res) => {

  try {

    const claim =
      await Claim.findById(
        req.params.id
      );

    if (!claim) {

      return res.status(404).json({
        message:
          "Claim not found",
      });

    }

    claim.status =
      req.body.status;

    await claim.save();

    if (
      req.body.status ===
      "approved"
    ) {

      await Item.findByIdAndUpdate(
        claim.itemId,
        {
          isClaimed: true,
        }
      );

    }

    res.json({
      success: true,
      message: `Claim ${req.body.status}`,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

});

module.exports = router;