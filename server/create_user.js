async function registerUser() {
    try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Admin User',
                email: 'admin@example.com',
                password: 'password123',
                department: 'IT',
                position: 'Admin'
            })
        });
        const data = await response.json();
        console.log('User registered:', data);
    } catch (error) {
        console.log('Error:', error.message);
    }
}

registerUser();
