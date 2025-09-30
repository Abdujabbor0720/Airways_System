import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: Transporter;
  private fromName: string;
  private fromEmail: string;
  private frontendUrl: string;

  constructor(private readonly cfg: ConfigService) {
    const host = this.cfg.get<string>('SMTP_HOST', 'localhost');
    const port = Number(this.cfg.get<string>('SMTP_PORT', '1025'));
    const secure = this.cfg.get<string>('SMTP_SECURE', 'false') === 'true';
    const user = this.cfg.get<string>('SMTP_USER') || undefined;
    const pass = this.cfg.get<string>('SMTP_PASS') || undefined;
    this.fromName = this.cfg.get<string>('SMTP_FROM_NAME', 'Airways');
    this.fromEmail = this.cfg.get<string>('SMTP_FROM_EMAIL', 'noreply@example.com');
    this.frontendUrl = this.cfg.get<string>('FRONTEND_URL', 'http://localhost:5173');
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: user && pass ? { user, pass } : undefined,
    });
  }

  async send(to: string, subject: string, html: string) {
    try {
      await this.transporter.sendMail({
        from: `${this.fromName} <${this.fromEmail}>`,
        to,
        subject,
        html,
      });
    } catch (e) {
      
    }
  }

  emailVerifyLink(token: string) {
    const base = this.frontendUrl.replace(/\/$/, '');
    return `${base}/verify-email?token=${encodeURIComponent(token)}`;
  }

  passwordResetLink(token: string) {
    const base = this.frontendUrl.replace(/\/$/, '');
    return `${base}/reset-password?token=${encodeURIComponent(token)}`;
  }
}
