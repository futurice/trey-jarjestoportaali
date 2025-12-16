using Azure;
using Azure.Communication.Email;

namespace Trey.Api.Services;

public interface IEmailService
{
  Task<EmailSendOperation> SendAccountCreatedEmail(string email, string username, string password);
}

internal sealed class EmailService : IEmailService
{
  private readonly Supabase.Client supabaseClient;
  private readonly EmailClient emailClient;

  public EmailService(Supabase.Client supabaseClient, EmailClient emailClient)
  {
    this.supabaseClient = supabaseClient;
    this.emailClient = emailClient;
  }

  public async Task<EmailSendOperation> SendAccountCreatedEmail(string email, string username, string password)
  {
    var emailContent = new EmailContent("TREY Jippo - Uusi käyttäjätili luotu")
    {
      Html = "<html><body><div class=\"email-fi\"><h1>TREY Jippo - Kirjautuminen on uudistunut!</h1><p>Jippoon kirjautuminen on uudistunut, ja kaikille TREY:n järjestöille on luotu uudet kirjautumistiedot.</p><p>Voit kirjautua Jippoon osoitteessa <a href=\"https://jippo.trey.fi\">https://jippo.trey.fi</a></p><ul><li><strong>Käyttäjätunnus:</strong> {{Username}}</li><li><strong>Salasana:</strong> {{Password}}</li></ul><p>Suosittelemme vaihtamaan generoidun salasanan mahdollisimman pian.</p></div><div class=\"email-en\"><h1>TREY Jippo - Login flow has been renewed!</h1><p>The login flow for Jippo has been renewed, and new login credentials have been created for all TREY organizations.</p><p>You can log in to Jippo at <a href=\"https://jippo.trey.fi\">https://jippo.trey.fi</a></p><ul><li><strong>Username:</strong> {{Username}}</li><li><strong>Password:</strong> {{Password}}</li></ul><p>We recommend changing the generated password as soon as possible.</p></div></body></html>"
    };

    var emailMessage = new EmailMessage(
        senderAddress: "trey-jippo@jippo.trey.fi",
        recipientAddress: email,
        content: emailContent
    );

    var response = await emailClient.SendAsync(WaitUntil.Completed, emailMessage);
    Console.WriteLine($"Email Sent. Status = {response.Value.Status}");

    /// Get the OperationId so that it can be used for tracking the message for troubleshooting
    string operationId = response.Id;
    Console.WriteLine($"Email operation id = {operationId}");
    return response;
  }
}
