const router = require("express").Router();
const ctrl = require("../controllers/parkingController");

router.post("/", ctrl.addParkingRequest);
router.get("/", ctrl.getParkingRequests);
router.get("/resident/:email", ctrl.getResidentParking);

router.put("/approve/:id", ctrl.approveParking);
router.put("/reject/:id", ctrl.rejectParking);

module.exports = router;