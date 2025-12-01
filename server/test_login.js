async function testLogin() {
    try {
        console.log('Testing Normal Login...');
        const res1 = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@example.com',
                password: 'password123',
                rememberMe: false
            })
        });
        const data1 = await res1.json();
        console.log('Normal Login Success. Token:', data1.token ? 'Present' : 'Missing');

        console.log('Testing Remember Me Login...');
        const res2 = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@example.com',
                password: 'password123',
                rememberMe: true
            })
        });
        const data2 = await res2.json();
        console.log('Remember Me Login Success. Token:', data2.token ? 'Present' : 'Missing');

    } catch (error) {
        console.log('Error:', error.message);
    }
}

testLogin();
