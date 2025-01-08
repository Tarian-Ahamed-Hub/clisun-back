const express = require("express");
const { getAucItems, getAuctionDetails, placeBid } = require("../controller/verifiedController");
const router = express.Router()
  

router.get("/getAucItems",getAucItems);
router.post("/getAucItem",getAuctionDetails);
router.post("/placeBid", placeBid);

module.exports = router;