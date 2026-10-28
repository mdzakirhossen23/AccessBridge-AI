# Security

## Reporting

Please open a GitHub issue without including secrets or personal data. For a sensitive vulnerability, contact the repository owner privately through the contact method shown on their GitHub profile.

## Deployment requirements

- Keep `GROQ_API_KEY` only in the server environment.
- Never commit `api-chat.php` if it contains a hard-coded secret.
- Apply HTTPS, request-size limits, rate limiting, and server logs with minimal personal data.
- Validate request JSON and return generic errors to clients.
- Keep PHP and hosting dependencies updated.

