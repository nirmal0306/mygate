const Resident = require("../models/Resident");
const Security = require("../models/Security");

exports.loginUser = async (req, res) => {
  try {
    const { email, descriptor } = req.body;

    // 1️⃣ Strong validation
    if (!email || !Array.isArray(descriptor) || descriptor.length !== 128) {
      return res.status(400).json({ message: "Invalid face data" });
    }

    let user = await Resident.findOne({ email });
    let role = "resident";

    if (!user) {
      user = await Security.findOne({ email });
      role = "security";
    }

    if (!user || !Array.isArray(user.faceDescriptor)) {
      return res.status(404).json({ message: "User or face data not found" });
    }

    if (user.faceDescriptor.length !== 128) {
      return res.status(400).json({ message: "Stored face data invalid" });
    }

    // 2️⃣ Convert both descriptors to numbers
    const dbDescriptor = user.faceDescriptor.map(Number);
    const incomingDescriptor = descriptor.map(Number);

    // 3️⃣ Euclidean distance
    let sum = 0;
    for (let i = 0; i < 128; i++) {
      sum += Math.pow(dbDescriptor[i] - incomingDescriptor[i], 2);
    }

    const distance = Math.sqrt(sum);

    console.log("🔍 Face distance:", distance);

    // 4️⃣ STRICT threshold (IMPORTANT)
    const THRESHOLD = 0.45; // 0.6 is TOO LOOSE

    if (distance > THRESHOLD) {
      return res.status(401).json({ message: "Face mismatch" });
    }

    // ✅ Success
    res.json({
      role,
      name: user.name,
      email: user.email
    });

  } catch (err) {
    console.error("Face login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
