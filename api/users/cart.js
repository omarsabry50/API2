const connectDB = require('../../config/db');
const User = require('../../models/User');
const Product = require('../../models/Product');
const auth = require('../../middleware/auth');

module.exports = async (req, res) => {
    await connectDB();

    auth(req, res, async () => {
        if (req.method === 'GET') {
            try {
                const user = await User.findById(req.user.id).populate('cart.product');
                res.status(200).json(user.cart);
            } catch (err) {
                console.error(err.message);
                res.status(500).send('Server Error');
            }
        } else if (req.method === 'POST') {
            const { productId, quantity } = req.body;
            try {
                const user = await User.findById(req.user.id);
                const product = await Product.findById(productId);

                if (!product) return res.status(404).json({ msg: 'Product not found' });

                const cartItem = user.cart.find(item => item.product.toString() === productId);
                if (cartItem) {
                    cartItem.quantity += quantity || 1;
                } else {
                    user.cart.push({ product: productId, quantity: quantity || 1 });
                }
                await user.save();
                res.status(200).json(user.cart);
            } catch (err) {
                console.error(err.message);
                res.status(500).send('Server Error');
            }
        } else {
            res.status(405).json({ message: 'Method Not Allowed' });
        }
    });
};