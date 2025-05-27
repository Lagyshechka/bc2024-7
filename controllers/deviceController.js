const handleError = (res, error, code = 500) => res.status(code).send(error.message || error);

exports.registerDevice = async (req, res) => {
    const { device_name, serial_number } = req.body;
    if (!device_name || !serial_number) {
        return res.status(400).send('Missing required fields');
    }

    try {
        const [existingDevices] = await req.db.query(
            'SELECT 1 FROM devices WHERE serial_number = ? LIMIT 1',
            [serial_number]
        );

        if (existingDevices.length) {
            return res.status(400).send('Device already exists');
        }

        await req.db.query(
            'INSERT INTO devices (device_name, serial_number) VALUES (?, ?)',
            [device_name, serial_number]
        );

        return res.sendStatus(200);
    } catch (err) {
        return handleError(res, err);
    }
};

exports.getAllDevices = async (req, res) => {
    try {
        const [devices] = await req.db.query(
            'SELECT device_name, serial_number FROM devices'
        );
        return res.json(devices);
    } catch (err) {
        return handleError(res, err);
    }
};

exports.takeDevice = async (req, res) => {
    const { user_name, serial_number } = req.body;
    if (!user_name || !serial_number) {
        return res.status(400).send('Missing required fields');
    }

    try {
        const [devices] = await req.db.query(
            'SELECT user_name FROM devices WHERE serial_number = ?',
            [serial_number]
        );

        if (!devices.length) {
            return res.status(404).send('Device not found');
        }

        if (devices[0].user_name) {
            return res.status(400).send('Device already taken');
        }

        await req.db.query(
            'UPDATE devices SET user_name = ? WHERE serial_number = ?',
            [user_name, serial_number]
        );

        return res.sendStatus(200);
    } catch (err) {
        return handleError(res, err);
    }
};

exports.getDeviceBySerial = async (req, res) => {
    const serial_number = req.params.serial_number;

    try {
        const [devices] = await req.db.query(
            'SELECT user_name, device_name FROM devices WHERE serial_number = ?',
            [serial_number]
        );

        if (!devices.length) {
            return res.status(404).send('Device not found');
        }

        return res.json(devices[0]);
    } catch (err) {
        return handleError(res, err);
    }
};
