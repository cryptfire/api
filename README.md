# Cryptfire install.cryptfire.io API

This is for developers 💻 to register an API key with their email address or phone number,
to get automated deployment of a preoptimized open source BaaS onto Cryptfire Infrastructure,
or to deploy on Public Clouds to be selected from Vultr, Hetzner, or Google. Choosiing us incldues a domain,
an ENS domain, and DNS records set up and maintainable through the CLI or web interface. 🚀

See the [Wiki](https://github.com/cryptfire/cryptfire-install-api/wiki) for instructions and details.

![logo](https://github.com/cryptfire/cryptfire-install-api/assets/114028070/651d0bee-5a40-43d6-9f9c-6f0316980626)

## Endpoints

| Endpoint                         | Description |
| -------------------------------- | ------------------------------------------- |
| GET /                            | Register Bash Script                        |
| POST /keygen                     | API Key retrieval                           |
| GET /keygen/:email/:code         | API Key retrieval                           |
| GET /key/validate/:email/:code   | Validate Email                              |
| POST /deploy/:type/:project      | Deployment on Cryptfire Infra               |
| POST /premium/start              | Upgrade to use Bare Metal                   |
| POST /premium/verify             | Verify payment                              |
| GET  /pricing/cloud              | Public Cloud Pricing                        |
| GET  /pricing/baremetal          | Public Baremetal Pricing                    |
| GET  /pricing/premium            | Premium Cryptfire Cloud Pricing             |



