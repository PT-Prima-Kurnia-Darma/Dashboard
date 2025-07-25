// mock-server.js
import Hapi from '@hapi/hapi';

// --- Server Configuration ---
const server = Hapi.server({
    port: 3001,
    host: 'localhost',
    routes: {
        cors: {
            origin: ['*'], // Allow all origins for testing
        },
    },
});

// --- Dummy User Data ---
const DUMMY_USER = {
  email: 'user@example.com',
  password: 'password123',
  token: 'fake-jwt-token-for-testing-hapi'
};

// --- Login Route ---
server.route({
    method: 'POST',
    path: '/api/auth/login',
    handler: (request, h) => {
        const { email, password } = request.payload;
        console.log(`Login attempt (Hapi): ${email}`);

        // Check if credentials match
        if (email === DUMMY_USER.email && password === DUMMY_USER.password) {
            // Success Case
            console.log('Result: Success');
            return h.response({ token: DUMMY_USER.token }).code(200);
        } else {
            // Failure Case
            console.log('Result: Failure');
            return h.response({ message: 'Invalid credentials. Please try again.' }).code(401);
        }
    }
});

// --- Start Server Function ---
const start = async () => {
    try {
        await server.start();
        console.log(`Mock server (Hapi) running at: ${server.info.uri}`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

// --- Initialize ---
process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

start();