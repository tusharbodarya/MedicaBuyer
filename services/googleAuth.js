const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Verify Google token
 * @param {string} token - Google ID token
 * @returns {Promise<Object>} - Google token payload
 */
exports.verifyGoogleToken = async (token) => {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    return ticket.getPayload();
};