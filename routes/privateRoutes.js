const express = require("express");
const router = express.Router()

const isAdmin = require("../middleware/isAdmin");
const adminRoutes = require("./adminRoutes");
const employeeRoutes = require("./employeeRoutes");
const isEmployee = require("../middleware/isEmployee");





router.use("/admin",isAdmin,adminRoutes);

router.use("/employee",isEmployee,employeeRoutes);







module.exports = router;