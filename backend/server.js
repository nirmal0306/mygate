const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");

dotenv.config();

// Connect Database
connectDB();

const app = express();

// ================= MIDDLEWARES =================

// Enable CORS
app.use(cors());

// Parse JSON
app.use(express.json());

// Parse form data
app.use(express.urlencoded({ extended: true }));

// Static folder for uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// ================= ROUTES =================

// Admin
app.use("/admin", require("./routes/adminRoutes"));

// Authentication
app.use("/api/auth", require("./routes/authRoutes"));

// Residents
app.use("/api/residents", require("./routes/residentRoutes"));

// Security
app.use("/api/security", require("./routes/securityRoutes"));

// Visitors
app.use("/api/visitors", require("./routes/visitorRoutes"));

// Events
app.use("/api/events", require("./routes/eventRoutes"));

// Complaints
app.use("/api/complaints", require("./routes/complaintRoutes"));

// Maintenance Payments
app.use("/api/maintenance", require("./routes/maintenanceRoutes"));

app.use("/api/parking", require("./routes/parkingRoutes"));

app.use("/api/notices", require("./routes/noticeRoutes"));

app.use("/api/leaves", require("./routes/leaveRoutes"));

app.use("/api/salary", require("./routes/salaryRoutes"));


// ================= ROOT =================

app.get("/", (req, res) => {
  res.send("MyGate Backend Running 🚀");
});


// ================= SERVER =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});