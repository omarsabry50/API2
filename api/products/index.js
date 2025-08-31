const connectDB = require('../../config/db');
const Product = require('../../models/Product');
const auth = require('../../middleware/auth');

module.exports = async (req, res) => {
    await connectDB();

    if (req.method === 'GET') {
        try {
            const products = await Product.find();
            res.status(200).json(products);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    } else if (req.method === 'POST') {
        auth(req, res, async () => {
            const { name, description, price, image } = req.body;
            try {
                const newProduct = new Product({ name, description, price, image });
                const product = await newProduct.save();
                res.status(200).json(product);
            } catch (err) {
                console.error(err.message);
                res.status(500).send('Server Error');
            }
        });
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};