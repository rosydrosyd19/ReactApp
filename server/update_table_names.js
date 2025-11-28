const fs = require('fs');
const path = require('path');

console.log('🔄 Updating table names in route files...\n');

// Table name mappings
const tableReplacements = [
    { old: 'FROM assets', new: 'FROM asset_items' },
    { old: 'INTO assets', new: 'INTO asset_items' },
    { old: 'UPDATE assets', new: 'UPDATE asset_items' },
    { old: 'DELETE FROM assets', new: 'DELETE FROM asset_items' },

    { old: 'FROM locations', new: 'FROM asset_locations' },
    { old: 'INTO locations', new: 'INTO asset_locations' },
    { old: 'UPDATE locations', new: 'UPDATE asset_locations' },
    { old: 'DELETE FROM locations', new: 'DELETE FROM asset_locations' },

    { old: 'FROM licenses', new: 'FROM asset_licenses' },
    { old: 'INTO licenses', new: 'INTO asset_licenses' },
    { old: 'UPDATE licenses', new: 'UPDATE asset_licenses' },
    { old: 'DELETE FROM licenses', new: 'DELETE FROM asset_licenses' },

    { old: 'FROM accessories', new: 'FROM asset_accessories' },
    { old: 'INTO accessories', new: 'INTO asset_accessories' },
    { old: 'UPDATE accessories', new: 'UPDATE asset_accessories' },
    { old: 'DELETE FROM accessories', new: 'DELETE FROM asset_accessories' },

    { old: 'FROM components', new: 'FROM asset_components' },
    { old: 'INTO components', new: 'INTO asset_components' },
    { old: 'UPDATE components', new: 'UPDATE asset_components' },
    { old: 'DELETE FROM components', new: 'DELETE FROM asset_components' },

    { old: 'FROM accounts', new: 'FROM asset_accounts' },
    { old: 'INTO accounts', new: 'INTO asset_accounts' },
    { old: 'UPDATE accounts', new: 'UPDATE asset_accounts' },
    { old: 'DELETE FROM accounts', new: 'DELETE FROM asset_accounts' },

    { old: 'FROM users', new: 'FROM core_users' },
    { old: 'INTO users', new: 'INTO core_users' },
    { old: 'UPDATE users', new: 'UPDATE core_users' },
    { old: 'DELETE FROM users', new: 'DELETE FROM core_users' },

    { old: 'FROM checkout_history', new: 'FROM asset_checkout_history' },
    { old: 'INTO checkout_history', new: 'INTO asset_checkout_history' },
    { old: 'UPDATE checkout_history', new: 'UPDATE asset_checkout_history' },

    { old: 'FROM license_assignments', new: 'FROM asset_license_assignments' },
    { old: 'INTO license_assignments', new: 'INTO asset_license_assignments' },
    { old: 'UPDATE license_assignments', new: 'UPDATE asset_license_assignments' },

    { old: 'FROM accessory_assignments', new: 'FROM asset_accessory_assignments' },
    { old: 'INTO accessory_assignments', new: 'INTO asset_accessory_assignments' },
    { old: 'UPDATE accessory_assignments', new: 'UPDATE asset_accessory_assignments' },

    { old: 'FROM component_assignments', new: 'FROM asset_component_assignments' },
    { old: 'INTO component_assignments', new: 'INTO asset_component_assignments' },
    { old: 'UPDATE component_assignments', new: 'UPDATE asset_component_assignments' },

    { old: 'FROM account_assignments', new: 'FROM asset_account_assignments' },
    { old: 'INTO account_assignments', new: 'INTO asset_account_assignments' },
    { old: 'UPDATE account_assignments', new: 'UPDATE asset_account_assignments' },

    { old: 'FROM location_checkout_history', new: 'FROM asset_location_checkout_history' },
    { old: 'INTO location_checkout_history', new: 'INTO asset_location_checkout_history' },
    { old: 'UPDATE location_checkout_history', new: 'UPDATE asset_location_checkout_history' },
];

// Update files in routes directory
const routesDir = path.join(__dirname, 'routes');
const files = fs.readdirSync(routesDir).filter(f => f.endsWith('.js'));

let totalReplacements = 0;

files.forEach(file => {
    const filePath = path.join(routesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let fileReplacements = 0;

    tableReplacements.forEach(({ old, new: newVal }) => {
        const regex = new RegExp(old, 'g');
        const matches = content.match(regex);
        if (matches) {
            content = content.replace(regex, newVal);
            fileReplacements += matches.length;
        }
    });

    if (fileReplacements > 0) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ ${file}: ${fileReplacements} replacements`);
        totalReplacements += fileReplacements;
    } else {
        console.log(`⏭️  ${file}: No changes needed`);
    }
});

console.log(`\n✨ Total replacements: ${totalReplacements}`);
console.log('📌 All route files updated with new table names!\n');
