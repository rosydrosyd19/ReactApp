const mysql = require('mysql2');

// Test with empty password
console.log('Testing with empty password...');
const db1 = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'asset_management_db'
});

db1.connect((err) => {
    if (err) {
        console.error('Empty password FAILED:', err.message);

        // Try with 'root' password
        console.log('\nTesting with password "root"...');
        const db2 = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'asset_management_db'
        });

        db2.connect((err) => {
            if (err) {
                console.error('Password "root" FAILED:', err.message);
                process.exit(1);
            }
            console.log('Password "root" SUCCESS!');
            console.log('\n⚠️  UPDATE db.js to use password: "root"');
            db2.end();
            process.exit(0);
        });
    } else {
        console.log('Empty password SUCCESS!');
        db1.end();
        process.exit(0);
    }
});
