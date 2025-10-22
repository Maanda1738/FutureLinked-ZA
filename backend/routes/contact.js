const express = require('express');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Rate limiting for contact form
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 3, // limit each IP to 3 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many contact requests. Please try again later.'
  }
});

// Setup email transporter
const createTransporter = () => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('SMTP configuration missing. Contact form emails will not be sent.');
    return null;
  }

  const port = Number(process.env.SMTP_PORT || 587);
  const secure = port === 465; // true for 465, false for other ports

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

// POST /api/contact
router.post('/', contactLimiter, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required'
      });
    }

    if (!email.includes('@') || email.length < 5) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email address'
      });
    }

    if (message.length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Message must be at least 10 characters long'
      });
    }

    const transporter = createTransporter();
    
    if (transporter) {
      // Send email
      const mailOptions = {
        from: process.env.SMTP_USER,
        to: 'futurelinked3@gmail.com',
        subject: `FutureLinked ZA Contact: ${subject}`,
        html: `
          <h3>New Contact Form Submission</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
          <hr>
          <p><small>Sent from FutureLinked ZA contact form</small></p>
        `
      };

      await transporter.sendMail(mailOptions);
      
      // Auto-reply to user
      const autoReplyOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: 'Thank you for contacting FutureLinked ZA',
        html: `
          <h3>Thank you for your message!</h3>
          <p>Hi ${name},</p>
          <p>We've received your message regarding "${subject}" and will get back to you within 24 hours.</p>
          <p>Best regards,<br>The FutureLinked ZA Team</p>
          <hr>
          <p><small>This is an automated response. Please do not reply to this email.</small></p>
        `
      };

      await transporter.sendMail(autoReplyOptions);
    }

    // Log the contact (you might want to save to database)
    console.log(`Contact form submission: ${email} - ${subject}`);

    res.json({
      success: true,
      message: 'Your message has been sent successfully. We\'ll get back to you within 24 hours.'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send message. Please try again later.'
    });
  }
});

// GET /api/contact/info
router.get('/info', (req, res) => {
  res.json({
    success: true,
    contact: {
      email: 'futurelinked3@gmail.com',
      phone: '071 568 9064',
      address: {
        city: 'South Africa',
        country: 'South Africa',
        description: 'Serving job seekers nationwide'
      },
      hours: {
        description: 'Available for inquiries',
        note: 'We respond to all messages within 24 hours'
      }
    }
  });
});

module.exports = router;