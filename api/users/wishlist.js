const connectDB = require('../../config/db');
const User = require('../../models/User');
const Product = require('../../models/Product');
const auth = require('../../middleware/auth');

module.exports = async (req, res) => {
    await connectDB();
    auth(req, res, async () => {
        if (req.method === 'GET') {
            try {
                const user = await User.findById(req.user.id).populate('wishlist');
                res.status(200).json(user.wishlist);
            } catch (err) {
                console.error(err.message);
                res.status(500).send('Server Error');
            }
        } else if (req.method === 'POST') {
            const { productId } = req.body;
            try {
                const user = await User.findById(req.user.id);
                if (user.wishlist.includes(productId)) {
                    return res.status(400).json({ msg: 'Product already in wishlist' });
                }
                user.wishlist.push(productId);
                await user.save();
                res.status(200).json(user.wishlist);
            } catch (err) {
                console.error(err.message);
                res.status(500).send('Server Error');
            }
        } else {
            res.status(405).json({ message: 'Method Not Allowed' });
        }
    });
};