require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.json());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use("/uploads", express.static("uploads"));

const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

const feedbackRoutes = require("./routes/feedbackRoutes");
app.use("/api/feedback", feedbackRoutes);

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const otpRoutes = require("./routes/otpRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/otp", otpRoutes);



app.listen(5000, () => {
  console.log("Server running on port 5000");
});