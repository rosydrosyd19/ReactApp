const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function runDebug() {
    try {
        // 1. Get all assets to find a valid ID
        console.log('Fetching assets...');
        const listRes = await axios.get('http://localhost:5000/api/assets');
        if (listRes.data.length === 0) {
            console.log('No assets found to update.');
            return;
        }
        const assetId = listRes.data[0].id;
        console.log(`Testing update on Asset ID: ${assetId}`);

        // 2. Prepare FormData similar to frontend
        const form = new FormData();
        form.append('name', 'Debug Asset Update');
        form.append('category', 'Debug Category');
        form.append('serial_number', 'DEBUG-123');
        form.append('status', 'Ready to Deploy');
        // Test with empty date first, as that was the suspect
        form.append('purchase_date', '');

        // 3. Send PUT request
        console.log('Sending PUT request...');
        try {
            const updateRes = await axios.put(`http://localhost:5000/api/assets/${assetId}`, form, {
                headers: {
                    ...form.getHeaders()
                }
            });
            console.log('Update Success:', updateRes.data);
        } catch (updateErr) {
            console.error('Update Failed Status:', updateErr.response?.status);
            console.error('Update Failed Data:', JSON.stringify(updateErr.response?.data, null, 2));
        }

    } catch (err) {
        console.error('General Error:', err.message);
    }
}

runDebug();
