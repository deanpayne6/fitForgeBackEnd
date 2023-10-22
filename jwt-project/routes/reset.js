const express = require('express');
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const router = express.Router();
const Token = require("../models/Token"); // Assuming you have a Token model

router.get('/requestPasswordReset', async (req, res) => {
    const { email } = req.body;

    // Assuming User and Token models are imported properly
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    // Generate a unique reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = await bcrypt.hash(resetToken, 10);

    // Save the token to the database
    await new Token({
        userId: user._id,
        token: hashedToken,
        createdAt: Date.now(),
    }).save();

    // Send reset password link to the user's email
    const resetLink = `${process.env.BASE_URL}/resetPassword?token=${resetToken}&userId=${user._id}`;
    sendEmail(user.email, "Password Reset Request", `Reset your password: ${resetLink}`);
    return res.status(200).json({ message: "Password reset link sent successfully" });
});

router.get('/resetPassword', async (req, res) => {
    const { token, userId } = req.query;

    // Retrieve the token from the database
    const passwordResetToken = await Token.findOne({ userId });

    if (!passwordResetToken) {
        return res.status(400).json({ error: "Invalid or expired password reset token" });
    }

    // Compare the provided token with the stored hashed token
    const isValidToken = await bcrypt.compare(token, passwordResetToken.token);

    if (!isValidToken) {
        return res.status(400).json({ error: "Invalid or expired password reset token" });
    }
    }
    const hash =  bcrypt.hash(password, Number(bcryptSalt));
    User.updateOne(
      { _id: userId },
      { $set: { password: hash } },
      { new: true }
    );
    const user =  User.findById({ _id: userId });
    sendEmail(
      user.email,
      "Password Reset Successfully",
      {
        name: user.name,
      },
      "./template/resetPassword.handlebars"
    );
     passwordResetToken.deleteOne();
    return true;
  });

 async function sendEmail(email, subject, text) {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            service: process.env.SERVICE,
            port: 587,
            secure: true,
            auth: {
                user: process.env.USER,
                pass: process.env.PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: subject,
            text: text,
        });

        console.log("email sent sucessfully");
    } catch (error) {
        console.log(error, "email not sent");
    }
};
module.exports = router;