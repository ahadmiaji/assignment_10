const OTP = require('../models/OTPModel');
const sendEmail = require('../utility/SendEmailUtility'); //It might need to create a function to send emails

// Generate and send an OTP to the user's email
exports.generateOTP = async (req, res) => {
    const { email } = req.body;
    const otp = generateRandomOTP(); //It should implement a function to generate a random OTP

    try {
        // Save the OTP to the database
        const otpRecord = new OTP({
            email,
            otp,
        });
        await otpRecord.save();

        // Send the OTP to the user's email
        sendEmail(email, 'Your OTP', `Your OTP: ${otp}`);

        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Verify the OTP
exports.verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        // Find the OTP record in the database
        const otpRecord = await OTP.findOne({ email, otp, status: 0 });

        if (!otpRecord) {
            return res.status(400).json({ error: 'Invalid OTP or OTP already used' });
        }

        // Update the OTP status to indicate it has been used
        otpRecord.status = 1;
        await otpRecord.save();

        res.status(200).json({ message: 'OTP verified successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
