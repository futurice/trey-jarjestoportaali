using System.Net.Mail;
using Microsoft.Extensions.Configuration;

namespace Trey.Api.Services;

public interface IEmailService
{
    Task SendVerificationEmailAsync(string email, string token);
    Task SendPasswordResetEmailAsync(string email, string token);
}

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private readonly string _smtpServer;
    private readonly int _smtpPort;
    private readonly string _smtpUsername;
    private readonly string _smtpPassword;
    private readonly string _fromEmail;
    private readonly string _webUri;

    public EmailService(IConfiguration configuration)
    {
        _configuration = configuration;
        _smtpServer = configuration["SMTP_SERVER"] ?? throw new ArgumentNullException("SMTP_SERVER");
        _smtpPort = int.Parse(configuration["SMTP_PORT"] ?? "587");
        _smtpUsername = configuration["SMTP_USERNAME"] ?? throw new ArgumentNullException("SMTP_USERNAME");
        _smtpPassword = configuration["SMTP_PASSWORD"] ?? throw new ArgumentNullException("SMTP_PASSWORD");
        _fromEmail = configuration["SMTP_FROM_EMAIL"] ?? throw new ArgumentNullException("SMTP_FROM_EMAIL");
        _webUri = configuration["WEB_URI"] ?? throw new ArgumentNullException("WEB_URI");
    }

    public async Task SendVerificationEmailAsync(string email, string token)
    {
        var verificationLink = $"{_webUri}/verify-email/{token}";
        var subject = "Verify your email address";
        var body = $@"
            <h2>Welcome to Trey!</h2>
            <p>Please verify your email address by clicking the link below:</p>
            <p><a href='{verificationLink}'>{verificationLink}</a></p>
            <p>If you did not create an account, you can safely ignore this email.</p>";

        await SendEmailAsync(email, subject, body);
    }

    public async Task SendPasswordResetEmailAsync(string email, string token)
    {
        var resetLink = $"{_webUri}/reset-password?token={token}";
        var subject = "Reset your password";
        var body = $@"
            <h2>Password Reset Request</h2>
            <p>You have requested to reset your password. Click the link below to proceed:</p>
            <p><a href='{resetLink}'>{resetLink}</a></p>
            <p>This link will expire in 24 hours.</p>
            <p>If you did not request a password reset, you can safely ignore this email.</p>";

        await SendEmailAsync(email, subject, body);
    }

    private async Task SendEmailAsync(string to, string subject, string body)
    {
        using var client = new SmtpClient(_smtpServer, _smtpPort)
        {
            EnableSsl = true,
            Credentials = new System.Net.NetworkCredential(_smtpUsername, _smtpPassword)
        };

        using var message = new MailMessage
        {
            From = new MailAddress(_fromEmail),
            Subject = subject,
            Body = body,
            IsBodyHtml = true
        };
        message.To.Add(to);

        await client.SendMailAsync(message);
    }
} 