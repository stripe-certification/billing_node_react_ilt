# Stripe Billing Workshop Application: Lora AI

<!-- toc -->

  * [Lora Overview](#lora-overview)
  * [Your tasks for today](#your-tasks-for-today)
  * [Setup](#setup)
    + [0. (Stripes-only) Ensure you have a valid directory](#0-stripes-only-ensure-you-have-a-valid-directory)
    + [1. Clone the repository](#1-clone-the-repository)
    + [2. Set up system dependencies](#2-set-up-system-dependencies)
    + [3. Install dependencies](#3-install-dependencies)
    + [4. Set up your environment variables](#4-set-up-your-environment-variables)
    + [5. Set up prerequisite objects](#5-set-up-prerequisite-objects)
    + [6. Start the client & server](#6-start-the-client--server)
- [Configure the Billing Customer Portal](#configure-the-billing-customer-portal)
  * [Running the Playwright smoke test](#running-the-playwright-smoke-test)

<!-- tocstop -->

## Lora Overview

Lora is a sample AI chatbot application which lets users choose from a number of models and charges them on a per-token basis. It demonstrates a few features:

- Representing a usage-based billing model using meters, products, and prices
- Starting a subscription using an [embedded Checkout Session](https://embedcheckout.com)
- [Registering usage](https://docs.stripe.com/billing/subscriptions/usage-based/recording-usage) from a given user via meter events
- Integrating the [Customer Portal](https://billing.stripe.com/customer-portal-demo) for lightweight subscription management
- Consuming webhook events to freeze service on cancelled accounts

For the sake of demonstration, the per-token prices you'll use today will be more than 100x higher than usual. This is to ensure that you'll be able to get some real numbers without having to run too many test prompts.

_Author's Note 1: This application is built toward the `2025-02-24.acacia` API version, but the more recent `2025-03-31.basil` has introduced breaking changes which impact this integration. In particular, the attributes of a Checkout Session have changed. The accounts we've created for you are configured to use `2025-02-24.acacia`, and if you're logged into the account, the API reference will show you that version. However, if you plug in API keys from an account on the latest version, this integration won't work._

_Author's Note 2: There is a minimal OpenAI integration included in this application. If you have an OpenAI account, you can plug in your own API keys to get real LLM responses rather than lorem ipsum. You can also explore OpenRouter.ai, which uses the OpenAI integration shape but lets you plug in other models, some of which are free._

## Your tasks for today

You can find every place which needs updates by searching for TODO, but here's a summary:

1. Set up Embedded Checkout in the `Subscribe` component. This will also require setting up the code which creates a Checkout Session in the server's `users` service.
2. Update `clients/stripe` in the server to fetch our prices.
3. Set up the flow for creating meter events when somebody submits a prompt. You'll make changes from the prompt form all the way through to the server's `chat` service.
4. Set up the code which updates a user's account status if their payment fails.
5. Redirect users to the Customer Portal in order to complete actions like updating their payment method or canceling their subscription.


## Setup

The commands below were written for a `bash` terminal on a Unix system. If you're on Windows, we recommend working with Ubuntu on WSL, but the commands should also run in PowerShell.

### 0. (Stripes-only) Ensure you have a valid directory

```bash
mkdir -p ~/stripe
cd ~/stripe
```

### 1. Clone the repository

If you're unfamiliar with cloning repositories, we have instructions below for whether or not you have an SSH key.

<details open>

<summary>My GitHub account has an SSH key</summary>

```bash
git clone git@github.com:stripe-certification/billing_node_react_ilt.git
cd billing_node_react_ilt
```

</details>

<details>

<summary>My GitHub account doesn't have an SSH key</summary>

You can quickly clone the repo by using the GitHub CLI.  You can install it via:

- Unix systems with `brew`: `brew install gh`
- Windows systems: `winget install --id GitHub.cli`
- Other: https://github.com/cli/cli#installation

```bash
gh auth login
gh repo clone stripe-certification/billing_node_react_ilt
cd billing_node_react_ilt
```

</details>
   
### 2. Set up system dependencies

You can install the Stripe CLI with brew by running: 

`brew install stripe/stripe-cli/stripe`. 

If you're on a Windows machine or don't have `brew`, check [here](https://docs.stripe.com/stripe-cli) for other installation commands.

We'll use Node v22.15.0 on this application.  You can set it up with [`nodenv`](https://github.com/nodenv/nodenv) by running:

```bash
nodenv install 22.15.0
nodenv local 22.15.0
```

If you don't already have `nodenv` installed, then you can do so with their [easy installation](https://github.com/nodenv/nodenv-installer#nodenv-installer) package: `npx @nodenv/nodenv-installer`.

### 3. Install dependencies

The client and server run separately in this project, so we recommend opening two terminals side-by-side.

In the first terminal, install the server dependencies:
  

```bash
cd ./code/server
npm install
```

In the second terminal, install the client dependencies:

```bash
cd ./code/client
npm install
```

### 4. Set up your environment variables

You'll need to set up the environment variables on both sides of the project.  

0. Make sure you're logged into the account we created for you (`sessions-dev`).
1. Go to the Dashboard's [API key page](https://dashboard.stripe.com/test/apikeys) so that you'll have the publishable and secret keys on hand.
2. Run `stripe login` to get your CLI synced with your account. Once that's complete, run `stripe listen --print-secret` to get your webhook secret.
3. From your terminal in `code/server`, run `cp ./.env.example .env` to set up your `.env` file. Plug in the values for the Stripe secret, publishable, and webhook keys.
4. From your terminal in `code/client`, run `cp ./.env.example .env` to set up your `.env` file. Plug in the value for the Stripe publishable key.

### 5. Set up prerequisite objects

The Lora billing model depends on 4 products, 3 of which are metered.  All of them have both monthly and recurring prices.  You should have created these resources on your account earlier today, but if you haven't yet, then you'll find the instructions and commands for doing so in the [Companion App's M4-1](https://stripe-certification.github.io/companion-app/#/s25-billing/m4-1).


### 6. Start the client & server

1. From your terminal in `code/server`, run `npm run dev`.
2. From your terminal in `code/client`, run `npm run dev`.
3. Open `localhost:3000` and the Lora app should open right up!


# Configure the Billing Customer Portal

Visit the [Customer Portal Settings page] (https://dashboard.stripe.com/test/settings/billing/portal) in your Stripe Dashboard to configure the billing portal.

Test Your Setup 1. Navigate to localhost:3000. You should see a landing page with a “Sign Up” section at the bottom. 2. If the client and server are communicating properly and you’ve created your prices, you should see a price listed for each plan. 3. Clicking “Get Started” should take you to a create account page. After completing the form, you should be redirected to http://localhost:3000/sign-up?plan=<selected-plan>.

## Running the Playwright smoke test

There's a minimal smoke test written in Playwright to ensure that the application still starts once the Stripe integration has been redacted.  Run it with the following commands:

```
npm install
export PLAYWRIGHT_BROWSERS_PATH=0
npx playwright install --with-deps chromium
npx playwright test
```

Note: Playwright installs browsers into a shared system directory by default. The environment variable exported above tells it to install browsers directly into this project folder, which is helpful on corporate devices which only allow binaries to be run from particular directories.  If you don't have that constraint, then the variable can be omitted.