const express = require('express');
const cors = require('cors');
const SSLCommerzPayment = require('sslcommerz-lts');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// SSLCommerz credentials
const store_id = 'tripn66a8968d7042f';
const store_passwd = 'tripn66a8968d7042f@ssl';
const is_live = false; // true for live, false for sandbox

// Endpoint to initiate payment
app.post('/initiate-payment', async (req, res) => {
    const {
        amount,
        currency,
        tran_id,
        success_url,
        fail_url,
        cancel_url,
        ipn_url,
        cus_name,
        cus_email,
        cus_phone,
        cus_add1,
    } = req.body;

    const post_data = {
        total_amount: amount,
        currency: currency,
        tran_id: tran_id,
        success_url: success_url,
        fail_url: fail_url,
        cancel_url: cancel_url,
        ipn_url: ipn_url,
        cus_name: cus_name,
        cus_email: cus_email,
        cus_phone: cus_phone,
        cus_add1: cus_add1,
        product_profile: 'general',
        product_name: 'Sample Product',
        product_category: 'Sample Category',
        ship_name: cus_name,
        ship_add1: cus_add1,
        ship_city: 'Dhaka',
        ship_postcode: '1000',
        ship_country: 'Bangladesh',
        shipping_method: 'NO',
    };

    try {
        const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
        const response = await sslcz.init(post_data);
        console.log(response, "responce")  
        if (response.GatewayPageURL) {
            res.json({ GatewayPageURL: response.GatewayPageURL });
        } else {
            console.error('Payment initiation failed:', response);
            res.status(500).json({ error: 'Payment initiation failed', details: response });
        }
    } catch (error) {
        console.error('Error initiating payment:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});

// Endpoint to handle SSLCommerz response
app.post('/payment-response', (req, res) => {
    console.log('Payment response:', req.body);
    res.sendStatus(200);
});


// Endpoint to handle SSLCommerz success response
app.post('/success', (req, res) => {
    // Handle POST request to /success
    console.log(req.body); // Access request data
    res.status(200).redirect('http://localhost:3000/success');
});

app.get('/success', (req, res) => {
    // Handle GET request from payment gateway (more likely)
    console.log(req.query); // Access query parameters if needed
    res.status(200).redirect('http://localhost:3000/success');
});

// Endpoint to handle SSLCommerz failure response
app.get('/fail', (req, res) => {
    res.send('Payment Failed');
});

// Endpoint to handle SSLCommerz cancel response
app.get('/cancel', (req, res) => {
    res.send('Payment Canceled');
});


// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
