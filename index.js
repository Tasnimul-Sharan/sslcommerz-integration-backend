const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// SSLCommerz credentials
const sslcommerzCredentials = {
    store_id: 'trave6610f8ceabaa0',
    store_passwd: 'trave6610f8ceabaa0@ssl',
    api_url: 'https://sandbox.sslcommerz.com/gwprocess/v3/checkout/api/sslcommerz.api.php', // Use sandbox URL for testing
};

// Endpoint to initiate payment
app.post('/initiate-payment', async (req, res) => {
    const {
        amount,
        currency,
        tran_id,
        success_url,
        fail_url,
        cancel_url,
        cus_name,
        cus_email,
        cus_phone,
        cus_add1,
    } = req.body;

    const post_data = {
        store_id: sslcommerzCredentials.store_id,
        store_passwd: sslcommerzCredentials.store_passwd,
        total_amount: amount,
        currency: currency,
        tran_id: tran_id,
        success_url: success_url,
        fail_url: fail_url,
        cancel_url: cancel_url,
        cus_name: cus_name,
        cus_email: cus_email,
        cus_phone: cus_phone,
        cus_add1: cus_add1,
        // Add other required fields here if needed
    };

    try {
        const response = await axios.post(sslcommerzCredentials.api_url, post_data);
        const data = response.data;

        if (data.GatewayPageURL) {
            res.json({ GatewayPageURL: data.GatewayPageURL });
        } else {
            res.status(500).json({ error: 'Payment initiation failed' });
        }
    } catch (error) {
        console.error('Error initiating payment:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Endpoint to handle SSLCommerz response
app.post('/payment-response', (req, res) => {
    // Handle payment response from SSLCommerz
    // You can validate the response here
    console.log('Payment response:', req.body);
    res.sendStatus(200);
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
