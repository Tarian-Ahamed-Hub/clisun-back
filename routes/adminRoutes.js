const express = require("express");
const router = express.Router()
const {   createRoom, addTenantToRoom, updateRoom, createOrUpdateHistory, 
      getHistoryByMonthYear,getAllRoomsWithTenants,removeTenant, 
      getRoomNameAndRent,
      updateRoomDetails,
      updateTenant,
      addProduct,
      getAllProducts,
      addToQueue,
      setPermission,
      getUserDetails} = require("../controller/adminController");
const upload = require("./privateUploadRoute");
const { getAuctionDetails } = require("../controller/adminController");


router.post("/addToQueue",upload,addToQueue);
router.post("/addProduct",upload,addProduct);

router.get("/getProducts",getAllProducts);     

// router.post("/createRoom",createRoom);
// router.post("/addTenant",addTenantToRoom);
// router.post("/updateRoom",updateRoom);
// router.post("/addRent",createOrUpdateHistory);
// router.post("/getDetails",getHistoryByMonthYear);
// router.get("/getRooms",getAllRoomsWithTenants);
// router.post("/removeTenant",removeTenant);
// router.post("/getRoom",getRoomNameAndRent);
// router.post("/setRoom",updateRoomDetails);
// router.post("/updateTenant",updateTenant);
router.post("/setPermission",setPermission);
router.get("/getUserDetails",getUserDetails);
router.get("/getAucHistory",getAuctionDetails);
module.exports = router;