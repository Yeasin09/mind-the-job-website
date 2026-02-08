import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

(async function () {
    console.log("Testing Resend API...");
    console.log("Key:", process.env.RESEND_API_KEY ? "Found" : "Missing");

    try {
        const { data, error } = await resend.emails.send({
            from: 'Mind the Job Test <info@mindthejob.com>',
            to: ['info@mindthejob.com'], // Sending to self
            subject: 'Resend API Key Test',
            html: '<strong>It works!</strong> The API Key and Domain are correct.',
        });

        if (error) {
            console.error("❌ FAILED:", error);
        } else {
            console.log("✅ SUCCESS! Email ID:", data.id);
        }
    } catch (err) {
        console.error("❌ CRISIS:", err);
    }
})();
