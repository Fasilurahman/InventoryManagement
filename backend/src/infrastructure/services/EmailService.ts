import nodemailer from 'nodemailer';

export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER!,
        pass: process.env.EMAIL_PASS!,
      },
    });
  }

  async sendEmailWithAttachment(toEmail: string, subject: string, text: string, buffer: Buffer, filename: string) {
    await this.transporter.sendMail({
      from: `"Reports" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject,
      text,
      attachments: [
        {
          filename,
          content: buffer,
        },
      ],
    });
  }
}
