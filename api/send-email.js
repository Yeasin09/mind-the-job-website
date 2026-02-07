import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { name, email, message } = request.body;

        const { data, error } = await resend.emails.send({
            from: 'Mind the Job Website <no-reply@mindthejob.com>',
            to: ['info@mindthejob.com'],
            reply_to: email, // This allows you to hit "Reply" and email the user back
            subject: `New Message from ${name}`,
            html: `
        <h2>New Request from Website</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
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
