/**
 * The Aurora Cafe - Global Settings
 * These are the default settings. The owner can override these via the Admin Dashboard.
 */

const CAFE_SETTINGS = {
    // Basic Info
    name: "The Aurora Cafe",
    phone: "+91 12345 67890",
    email: "hello@auroracafe.demo",
    address: "42 Moonlit Avenue, Zion City",

    // Default Hours (24h format)
    hours: {
        weekday: { open: 10, close: 23 },
        weekend: { open: 9, close: 23 }
    },

    // Manual Overrides
    // mode options: 'auto', 'open', 'closed'
    statusMode: 'auto',
    statusMessage: "" // Optional custom message
};

// Export for use in other scripts
if (typeof module !== 'undefined') {
    module.exports = CAFE_SETTINGS;
}
