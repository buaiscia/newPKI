const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");
const app = express();




// ROOT ROUTE

router.get("/", function(req, res) {
    res.render("landing");
});




module.exports = router;