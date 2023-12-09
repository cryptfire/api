# Cryptfire Open Source API

This is for developers 💻 to register an API key with their email address or phone number,
to get automated public cloud deployment of a preoptimized open source BaaS in terms of either
Virtual Servers or Bare Metal, provided by a discrete set of known hosters, or using experimental
Cryptfire Infrastructure for extra performance. Deployment on Public Clouds to be selected from Vultr,
Hetzner, or Google. Choosiing us incldues a domain, an ENS domain, and DNS records set up and maintainable through the CLI or web interface. 🚀

See the [Wiki](https://github.com/cryptfire/cryptfire-install-api/wiki) for instructions and details.

```bash
npm install;
npm run build;
pm2 start npm -- start
```

![logo](https://github.com/cryptfire/cryptfire-install-api/assets/114028070/651d0bee-5a40-43d6-9f9c-6f0316980626)

This is a NodeJS, MongoDB, Redis, Appwrite, ExpressJS Stack providing a high-performance API for Developers to 
interact with Cryptfire Cloud  or a diverse set of other Clouds.

Each component, including the choice of NodeJS vs. Typescript, was selected with care.

![colorstack](https://github.com/cryptfire/cryptfire-install-api/assets/114028070/a74fa959-0f32-4992-b27f-8246392501f3)


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



