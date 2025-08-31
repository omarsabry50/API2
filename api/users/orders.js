const connectDB = require('../../config/db');
const Order = require('../../models/Order');
const User = require('../../models/User');
const auth = require('../../middleware/auth');

module.exports = async (req, res) => {
    await connectDB();
    auth(req, res, async () => {
        if (req.method === 'GET') {
            try {
                const orders = await Order.find({ user: req.user.id }).populate('items.product');
                res.status(200).json(orders);
            } catch (err) {
                console.error(err.message);
                res.status(500).send('Server Error');
            }
        } else if (req.method === 'POST') {
            try {
                const user = await User.findById(req.user.id).populate('cart.product');

                if (user.cart.length === 0) return res.status(400).json({ msg: 'Cart is empty' });
                
                const items = user.cart.map(item => ({ product: item.product._id, quantity: item.quantity }));
                const totalPrice = user.cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);

                const newOrder = new Order({ user: req.user.id, items, totalPrice });
                await newOrder.save();

                user.cart = [];
                await user.save();

                res.status(200).json(newOrder);
            } catch (err) {
                console.error(err.message);
                res.status(500).send('Server Error');
            }
        } else {
            res.status(405).json({ message: 'Method Not Allowed' });
        }
    });
};