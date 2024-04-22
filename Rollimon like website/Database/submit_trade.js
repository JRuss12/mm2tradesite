const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
mongoose.connect('mongodb+srv://Josh12R:NMkpDv0KEiTCF7XA@mm2trading.zucfrsn.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.once('open', () => {
    console.log('Connected to MongoDB');
});
db.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

// Trade schema
const tradeSchema = new mongoose.Schema({
    offeredItems: String,
    requestedItems: String,
    additionalDetails: String
});
const Trade = mongoose.model('Trade', tradeSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Handle trade submission
app.post('/submit_trade', (req, res) => {
    const { offered_items, requested_items, additional_details } = req.body;

    // Create a new trade object
    const newTrade = new Trade({
        offeredItems: offered_items,
        requestedItems: requested_items,
        additionalDetails: additional_details
    });

    // Save the trade to MongoDB
    newTrade.save()
        .then(() => {
            console.log('Trade submitted successfully');
            // Redirect to browse trades page after successful submission
            res.redirect('/browse_trades');
        })
        .catch((err) => {
            console.error('Error submitting trade:', err);
            res.status(500).send('Error submitting trade');
        });
});

// Route to fetch all trades
app.get('/browse_trades', (req, res) => {
    // Fetch all trades from the database
    Trade.find()
        .then(trades => {
            res.render('browse_trades', { trades: trades });
        })
        .catch(err => {
            console.error('Error fetching trades:', err);
            res.status(500).send('Error fetching trades');
        });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});