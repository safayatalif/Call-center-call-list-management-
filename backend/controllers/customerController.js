const fs = require('fs');
const csv = require('csv-parser');
const Customer = require('../models/Customer');

exports.uploadCustomers = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const results = [];
    const projectId = req.params.id;

    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            try {
                const customers = results.map(item => ({
                    projectId,
                    name: item.name || item.Name,
                    phone: item.phone || item.Phone,
                    address: item.address || item.Address,
                    notes: item.notes || item.Notes
                }));

                await Customer.insertMany(customers);
                fs.unlinkSync(req.file.path); // Remove file after processing
                res.json({ message: 'Customers uploaded successfully', count: customers.length });
            } catch (err) {
                console.error(err.message);
                res.status(500).send('Server error');
            }
        });
};

exports.getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find({ projectId: req.params.id });
        res.json(customers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
