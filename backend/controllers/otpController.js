const db = require("../config/db")
const otpGenerator = require("otp-generator")
const sendEmail = require("../utils/sendEmail")


exports.sendOTP = (req,res)=>{

const {email} = req.body

const otp = otpGenerator.generate(6,{
digits:true,
alphabets:false,
upperCase:false,
specialChars:false
})
const expiry = new Date(Date.now()+5*60*1000)

db.query(
"INSERT INTO otp_verification (email,otp,expires_at) VALUES (?,?,?)",
[email,otp,expiry],
async(err)=>{

if(err) return res.status(400).json(err)

await sendEmail(email,"OTP Verification",`Your OTP is ${otp}`)

res.json({message:"OTP Sent"})

})

}



exports.verifyOTP = (req,res)=>{

const {email,otp} = req.body

db.query(
"SELECT * FROM otp_verification WHERE email=? AND otp=?",
[email,otp],
(err,result)=>{

if(result.length==0){
return res.status(400).json({message:"Invalid OTP"})
}

res.json({message:"OTP Verified"})

})

}