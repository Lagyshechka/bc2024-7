const express = require('express');
const router = express.Router();

const deviceController = require('../controllers/deviceController');

router
  .post('/register', deviceController.registerDevice)
  .get('/devices', deviceController.getAllDevices)
  .post('/take', deviceController.takeDevice)
  .get('/devices/:serial_number', deviceController.getDeviceBySerial);

module.exports = router;
