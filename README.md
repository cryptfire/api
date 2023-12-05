# Cryptfire install.cryptfire.io API

This is for developers to register an API key with their email address,
and then have their Vultr and Namecheap API key entered, to get automated
deployment of preoptimized open source BaaS onto cheap Vultr cloud servers / a domain
registered and DNS records set up and maintained with Namecheap.

For production we recommend Dedicated vCPUs or just Bare Metal, which is significantly
more expensive.

You may upgrade to Cryptfire Premium to use our experimental infrastructure rather
than Vultr.



| Endpoint                         | Description |
| -------------------------------- | ------------------------------------------- |
| GET /                            | Register Bash Script                        |
| GET /key/:email                  | API Key retrieval                           |
| GET /key/validate/:email/:code   | Validate Email                              |
| POST /deploy/:type/:project      | Deployment on Vultr and Namecheap           |
| POST /premium/start              | Upgrade to use Cryptfire infrastructure     |
| POST /premium/verify             | Verify payment                              |

![logo](https://github.com/cryptfire/cryptfire-install-api/assets/114028070/651d0bee-5a40-43d6-9f9c-6f0316980626)
