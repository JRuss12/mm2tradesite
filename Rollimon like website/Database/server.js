const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Trade = require('./models/tradeSchema');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://Josh12R:NMkpDv0KEiTCF7XA@mm2trading.zucfrsn.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

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
            res.redirect('/browse_trades');
        })
        .catch((err) => {
            console.error('Error submitting trade:', err);
            res.status(500).send('Error submitting trade');
        });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});