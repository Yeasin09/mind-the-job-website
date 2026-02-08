import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { email, firstName } = request.body;

        const { data, error } = await resend.emails.send({
            from: 'Mind the Job Team <info@mindthejob.com>',
            to: [email],
            subject: 'Welcome to Mind the Job! 🚀',
            html: `
<div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #eeeeee; border-radius: 8px; overflow: hidden;">
  
  <!-- Header with Brand Color (Navy) -->
  <div style="background-color: #0B1C2E; padding: 30px; text-align: center;">
    <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 1px;">Mind the Job</h1>
  </div>

  <!-- Main Content -->
  <div style="padding: 40px 30px; color: #333333; line-height: 1.6;">
    <h2 style="color: #0B1C2E; font-size: 20px; margin-top: 0;">Welcome, ${firstName}!</h2>
    
    <p style="font-size: 16px; color: #555555; margin-bottom: 24px;">
      We are thrilled to have you join <strong>Mind the Job</strong>. You have taken the first step towards finding your perfect career match.
    </p>

    <p style="font-size: 16px; color: #555555; margin-bottom: 30px;">
      Your account is now active. You can log in anytime to update your profile, browse jobs, and connect with top employers.
    </p>

    <!-- Call to Action Button (Teal) -->
    <div style="text-align: center; margin: 35px 0;">
      <a href="https://mindthejob.com/candidates" style="background-color: #14b8a6; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px; display: inline-block;">Complete Your Profile</a>
    </div>

    <p style="font-size: 14px; color: #999999; margin-top: 30px;">
      If you have any questions, feel free to reply to this email. We're here to help!
    </p>
  </div>

  <!-- Footer -->
  <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #aaaaaa; border-top: 1px solid #eeeeee;">
    <p style="margin: 0;">&copy; ${new Date().getFullYear()} Mind the Job. All rights reserved.</p>
    <p style="margin: 5px 0 0 0;">London, United Kingdom</p>
  </div>
</div>
            `,
        });

        if (error) {
            return response.status(400).json({ error });
        }

        return response.status(200).json({ data });
    } catch (error) {
        return response.status(500).json({ error: error.message });
    }
}
