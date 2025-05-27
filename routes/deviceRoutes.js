const express = require('express');
const router = express.Router();

const {
  registerDevice,
  getAllDevices,
  takeDevice,
  getDeviceBySerial
} = require('../controllers/deviceController');

router.post('/register', registerDevice);
router.get('/devices', getAllDevices);
router.post('/take', takeDevice);
router.get('/devices/:serial_number', getDeviceBySerial);

module.exports = router;
