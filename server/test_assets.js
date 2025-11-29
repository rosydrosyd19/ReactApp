const axios = require('axios');

async function testAssetsEndpoint() {
    try {
        console.log('Testing GET /api/assets...');
        const response = await axios.get('http://localhost:5000/api/assets');
        console.log('Success! Got', response.data.length, 'assets');
    } catch (error) {
        console.error('Error Status:', error.response?.status);
        console.error('Error Data:', JSON.stringify(error.response?.data, null, 2));
    }
}

testAssetsEndpoint();
