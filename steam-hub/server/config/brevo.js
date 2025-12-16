const SibApiV3Sdk = require('sib-api-v3-sdk');

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

const sendVerificationEmail = async (email, token) => {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.subject = "Verify your SteamHub Account";
    sendSmtpEmail.htmlContent = `<html><body><h1>Welcome to SteamHub</h1><p>Please verify your account by clicking the link below:</p><a href="http://localhost:3000/api/verify-email?token=${token}">Verify Email</a></body></html>`;
    sendSmtpEmail.sender = { "name": "SteamHub Team", "email": process.env.BREVO_SENDER_EMAIL };
    sendSmtpEmail.to = [{ "email": email }];

    try {
        const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('[BREVO] Email sent successfully. Returned data: ' + JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('[BREVO] Error sending email:', error);
        return false;
    }
};

module.exports = { sendVerificationEmail };
