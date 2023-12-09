# Cryptfire install.cryptfire.io API

This is for developers to register an API key with their email address,
to get automated deployment of a preoptimized open source BaaS onto Cryptfire Infrastructure.
This incldues a domain, an ENS domain, and DNS records set up and maintainable through the
CLI or web interface.

![logo](https://github.com/cryptfire/cryptfire-install-api/assets/114028070/651d0bee-5a40-43d6-9f9c-6f0316980626)

## Endpoints

| Endpoint                         | Description |
| -------------------------------- | ------------------------------------------- |
| GET /                            | Register Bash Script                        |
| GET /key/:email                  | API Key retrieval                           |
| GET /key/validate/:email/:code   | Validate Email                              |
| POST /deploy/:type/:project      | Deployment on Vultr and Namecheap           |
| POST /premium/start              | Upgrade to use Cryptfire infrastructure     |
| POST /premium/verify             | Verify payment                              |
