const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
    try {
        console.log('Starting API Verification...');

        // Helper for fetch
        const request = async (url, method, body) => {
            const options = {
                method,
                headers: { 'Content-Type': 'application/json' },
            };
            if (body) options.body = JSON.stringify(body);
            const res = await fetch(url, options);
            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Request failed: ${res.status} ${text}`);
            }
            return res.json();
        };

        // 1. Create Accessory
        console.log('1. Creating Accessory...');
        const createRes = await request(`${BASE_URL}/accessories`, 'POST', {
            name: 'API Test Accessory',
            total_quantity: 10,
            category: 'Test',
            notes: 'Created via verification script'
        });
        const accessoryId = createRes.id;
        console.log('   Success! ID:', accessoryId);

        // 2. Get Accessory
        console.log('2. Getting Accessory...');
        const getRes = await request(`${BASE_URL}/accessories/${accessoryId}`, 'GET');
        if (getRes.available_quantity !== 10) throw new Error('Available quantity mismatch');
        console.log('   Success! Available:', getRes.available_quantity);

        // 3. Check Out
        console.log('3. Checking Out...');
        await request(`${BASE_URL}/accessories/${accessoryId}/checkout`, 'POST', {
            assigned_to: 'Test User',
            assigned_type: 'user',
            quantity: 2,
            notes: 'Checkout test'
        });
        console.log('   Success!');

        // 4. Verify Quantity Decrease
        console.log('4. Verifying Quantity Decrease...');
        const afterCheckoutRes = await request(`${BASE_URL}/accessories/${accessoryId}`, 'GET');
        if (afterCheckoutRes.available_quantity !== 8) throw new Error(`Expected 8, got ${afterCheckoutRes.available_quantity}`);
        console.log('   Success! Available:', afterCheckoutRes.available_quantity);

        // 5. Get Assignments
        console.log('5. Getting Assignments...');
        const assignmentsRes = await request(`${BASE_URL}/accessories/${accessoryId}/assignments`, 'GET');
        const assignmentId = assignmentsRes[0].id;
        console.log('   Success! Assignment ID:', assignmentId);

        // 6. Check In
        console.log('6. Checking In...');
        await request(`${BASE_URL}/accessories/${accessoryId}/checkin/${assignmentId}`, 'POST');
        console.log('   Success!');

        // 7. Verify Quantity Increase
        console.log('7. Verifying Quantity Increase...');
        const afterCheckinRes = await request(`${BASE_URL}/accessories/${accessoryId}`, 'GET');
        if (afterCheckinRes.available_quantity !== 10) throw new Error(`Expected 10, got ${afterCheckinRes.available_quantity}`);
        console.log('   Success! Available:', afterCheckinRes.available_quantity);

        // 8. Delete Accessory
        console.log('8. Deleting Accessory...');
        await request(`${BASE_URL}/accessories/${accessoryId}`, 'DELETE');
        console.log('   Success!');

        console.log('ALL TESTS PASSED!');
    } catch (error) {
        console.error('TEST FAILED:', error.message);
    }
}

runTests();
