const router = require("express").Router()
const otp = require("../controllers/otpController")

router.post("/send",otp.sendOTP)

router.post("/verify",otp.verifyOTP)

module.exports = router