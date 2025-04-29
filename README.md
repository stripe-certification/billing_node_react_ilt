# Stripe Billing Workshop Application: Lora AI

Lora is a sample AI chatbot application built to demonstrate how Stripe Billing can enable usage-based credit burndown models.

## Prerequisites

- Node.js v22.15.0
- [Install](https://docs.stripe.com/stripe-cli) the Stripe CLI
- Access to a Stripe account

## Your tasks for today

You can find every place which needs updates by searching for TODO, but here's a summary:

1. Set up Embedded Checkout in the `Subscribe` component. This will also require setting up the code which creates a Checkout Session in the server's `users` service.
2. Update `clients/stripe` in the server to fetch our prices.
3. Set up the flow for creating meter events when somebody submits a prompt. You'll make changes from the prompt form all the way through to the server's `chat` service.
4. Set up the code which updates a user's account status if their payment fails.
5. Redirect users to the Customer Portal in order to complete actions like updating their payment method or canceling their subscription.

## Setup

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

You can quickly clone the repo by using the GitHub CLI.

```bash
brew install gh
gh auth login
gh repo clone stripe-certification/billing_node_react_ilt
cd billing_node_react_ilt
```

</details>
   
### 2. Set up system dependencies

You can install the Stripe CLI with brew by running `brew install stripe/stripe-cli/stripe`. If you don't have `brew`, check [here](https://docs.stripe.com/stripe-cli) for other installation commands.

We'll use Node v22.15.0 on this application.  You can set it up with `nodenv` by running:

```bash
nodenv install 22.15.0
nodeenv local 22.15.0
```

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