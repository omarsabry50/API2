const connectDB = require('../../config/db');
const Product = require('../../models/Product');

module.exports = async (req, res) => {
    await connectDB();

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { id } = req.query; // Vercel uses req.query for dynamic parameters

    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};