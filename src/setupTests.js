import '@testing-library/jest-dom';

// Polyfill para TextEncoder en Node < 16
if (!global.TextEncoder) {
    global.TextEncoder = require('util').TextEncoder;
}