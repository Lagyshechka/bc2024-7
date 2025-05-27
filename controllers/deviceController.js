exports.registerDevice = async (req, res) => {
  const { device_name, serial_number } = req.body;
  if (!device_name || !serial_number) return res.status(400).json({ error: 'Missing fields' });

  try {
    const [existing] = await req.db.query('SELECT * FROM devices WHERE serial_number = ?', [serial_number]);
    if (existing.length > 0) return res.status(400).json({ error: 'Device already exists' });

    await req.db.query('INSERT INTO devices (device_name, serial_number) VALUES (?, ?)', [device_name, serial_number]);
    res.status(200).json({ message: 'Device registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllDevices = async (req, res) => {
  try {
    const [devices] = await req.db.query('SELECT device_name, serial_number FROM devices');
    res.status(200).json(devices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.takeDevice = async (req, res) => {
  const { user_name, serial_number } = req.body;
  if (!user_name || !serial_number) return res.status(400).json({ error: 'Missing fields' });

  try {
    const [device] = await req.db.query('SELECT * FROM devices WHERE serial_number = ?', [serial_number]);
    if (device.length === 0) return res.status(404).json({ error: 'Device not found' });

    if (device[0].user_name) return res.status(400).json({ error: 'Device already taken' });

    await req.db.query('UPDATE devices SET user_name = ? WHERE serial_number = ?', [user_name, serial_number]);
    res.status(200).json({ message: 'Device taken successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDeviceBySerial = async (req, res) => {
  const serial_number = req.params.serial_number;
  try {
    const [device] = await req.db.query('SELECT device_name, user_name FROM devices WHERE serial_number = ?', [serial_number]);
    if (device.length === 0) return res.status(404).json({ error: 'Device not found' });

    // user_name може бути null, це нормально
    res.status(200).json(device[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
