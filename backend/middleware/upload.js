// const multer = require("multer");
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const cloudinary = require("../config/cloudinary");

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: "mygate",
//     allowed_formats: ["jpg", "png", "jpeg"],
//   },
// });

// const upload = multer({ storage });

// module.exports = upload;

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    let folder = "uploads/others";

    // 🔥 Detect route
    if (req.originalUrl.includes("residents")) {
      folder = "uploads/residents";
    } else if (req.originalUrl.includes("visitors")) {
      folder = "uploads/visitors";
    } else if (req.originalUrl.includes("security")) {
      folder = "uploads/security";
    }

    return {
      folder: folder,
      allowed_formats: ["jpg", "png", "jpeg"],
    };
  },
});

const upload = multer({ storage });

module.exports = upload;
