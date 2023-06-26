<p align="center">
    <a href="https://vesperart.co" target="_blank">
        <img src="common/assets/logo.png" />
    </a>
</p>

</br>

![Production](https://github.com/msiric/vesper-demo/actions/workflows/production.yml/badge.svg)
![Staging](https://github.com/msiric/vesper-demo/actions/workflows/staging.yml/badge.svg)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-blue.svg)](
  https://conventionalcommits.org
)

Vesper is the first fully open-source art marketplace platform. The solution is based on React, Material UI, Express, PostgreSQL, Socket.io, AWS S3 and Stripe.

Official website: https://vesperart.co </br></br>
[Learn more about the project](https://vesperart.co/about) </br>
[How it works (for artists and collectors)](https://vesperart.co/how_it_works)

---
## Quick demo :clapper:
![Demo](https://github.com/msiric/vesper-art/assets/26199969/8a981c5a-c0a1-4510-a847-71ec95dcf8c0)


## Features :gift:

- **Custom authentication**: To ensure full user privacy, custom authentication is in place, without OAuth options, that supports auto-refreshing access tokens
- **Artist/collector profile creation**: Users can set up unified profiles to both showcase and collect work on the platform
- **Artwork management**: Artists have control over how their artwork is displayed and interacted with
- **Licensing control**: Artists can define the types of licenses available for each piece of their artwork, including free, personal, and/or commercial licenses
- **Artwork pricing**: Artists can set their own prices for their artwork licenses
- **Notifications**: Users receive real-time updates  whenever there is relevant information concerning them
- **Dashboard**: Users can track their progress and sales/purchases through their dashboard
- **Secure payment processing**: Stripe is used for all transactions, ensuring secure processing, fee management and delivery of funds
- **Artwork interaction**: Collectors can browse and explore various artworks from different artists and favorite, comment on, and purchase/download their work
- **Artwork collection**: Collectors can admire their collection in a gallery view, complete with a slideshow feature
- **License verification**: A robust system is in place for users to verify the authenticity of every purchased/downloaded artwork
- **Multi-device usage**: Collectors can download their purchased artworks on multiple devices without DRM restrictions
- **License management**: Detailed information about every license can be accessed and verified using the platform's verifier system
- And [much more](https://vesperart.co/how_it_works)

  
## Installation :hammer_and_wrench:

### 1. Clone the repository

```bash
git clone https://github.com/msiric/vesper-demo
```

### 2. Install dependencies

```bash
yarn && cd client && yarn && cd ..
```

### 3. Manage .env files

The application uses five different environments: development, production, staging, seeding and testing.
To run the application locally, create a `.env.development` file using the `.env.example` file as a reference with your own configuration.

### 4. Run the application

To run the application, VS Code's run tasks are used: Terminal -> Run task -> Run *name of task* (e.g. Run dev)
To enable payments, make sure to [set up Stripe](https://stripe.com/docs/stripe-cli) and logging in before running the app. 

### 5. Run the tests

To run the E2E tests on the test DB:
```bash
yarn test
```
There are additional options specified in the `package.json` file that allow for file watching, test coverage and fresh DB wipe with test assets being uploaded to S3 for a clean slate test run.

### 6. Seed the DB

```bash
yarn seed:dev-db OR yarn seed:test-db
```
Again, additional options are available for finer control such as: `seed-test-db-entities` and `seed:test-db-s3`

### 6. Deployment

Deployments are automatically taken care of using GitHub actions. 
On every pull request merge, the app is deployed to the staging environment and on every GitHub release, the app is deployed to production.

## Contribution :busts_in_silhouette:

Issues and PRs are welcomed.

### Like what you see? Give the repo a star! :star:
