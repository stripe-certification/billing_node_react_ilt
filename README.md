## Stripe Billing Workshop Application: Lora AI

# Stripe Billing Usage-Based Subscription Example

This application is built for educational purposes as an example of how to use Stripe Billing to create a usage-based subscription model.

## Prerequisites

- Node.js v20.17.0
- Stripe CLI
- Access to a Stripe account

## Setup

0. **(Stripe-only) Ensure you have a valid directory**

```bash
mkdir -p ~/stripe
cd ~/stripe
```

1. **Clone the repository:**

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
   
2. **Set up system dependencies**

You can install the Stripe CLI with brew by running `brew install stripe/stripe-cli/stripe`. If you don't have `brew`, check [here](https://docs.stripe.com/stripe-cli) for other installation commands.

We'll use Node v20.17.0 on this application.  You can set it up with `nodenv` by running:

```bash
nodenv install 20.17.0
nodeenv local 20.17.0
```

2. **Install Backend dependencies:**

   Navigate to the backend directory and run:

   ```bash
   cd ./servers/node/server
   npm install
   ```

3. **Install Frontend dependencies:**

   Navigate to the frontend directory and run:

   ```bash
   cd ./client/nextjs/client
   npm install
   ```

4. **Copy environment variables:**

   Copy the `.env.example` files to `.env` and populate with your Stripe keys.

   Optional: You can run the following commands from the root directory to generate the `.env` files:

   ```bash
   cp ./servers/node/server/.env.example ./servers/node/server/.env
   cp ./client/nextjs/client/.env.example ./client/nextjs/client/.env
   ```

5. **Start local webhook listener:**

   Open a terminal and run the following command in `./servers/node/server` to start your local webhook listener. Copy the webhook secret and paste it into `./servers/node/server/.env`.

   ```bash
   stripe listen --forward-to http://localhost:4242/webhooks
   ```

6. **Start the server:**

   In a terminal, run the following command within `./servers/node/server` to start the server:

   ```bash
   npm run dev
   ```

7. **Start the client:**

   In another terminal, run the following command within `./client/nextjs/client` to start the client:

   ```bash
   npm run dev
   ```

## Create Expected Stripe Objects

Using the Stripe Dashboard or Workbench, create the following objects:

- **3 meters**
- **4 products** (1 for each meter, 1 for prepaid tokens)
- **6 model prices** (2 for each meter; 1 monthly, 1 yearly)
- **2 recurring (prepaid) prices** (1 monthly, 1 yearly) for a total of 8 prices

### Step 1: Create Meter Objects

Create three `Meter` objects with different `event_name` values (`titan`, `claude`, and `chatgpt`).

**Note** some required fields are not included via Stripe Workbench API Explorer
be sure to include `-d "customer_mapping[type]=by_id"` manually in your request.

Example:

```javascript
const meter = await stripe.billing.meters.create({
  display_name: "<event_name> AI tokens",
  event_name: "titan",
  default_aggregation: {
    formula: "sum",
  },
  customer_mapping: {
    event_payload_key: "stripe_customer_id",
    type: "by_id",
  },
});
```

Step 2: Create Products and Prices

Create 4 products to represent the Models & Prepaid Tokens. **Tip: Include product_data in your price creation calls.**

Example:

```javascript
const price = await stripe.prices.create({
  currency: "usd",
  unit_amount: 5,
  billing_scheme: "per_unit",
  transform_quantity: {
    divide_by: 1000,
    round: "up",
  },
  recurring: {
    usage_type: "metered",
    interval: "month",
    meter: "{{METER_ID}}",
  },
  product_data: {
    name: "AWS Titan",
  },
  lookup_key: "titan_monthly",
  transfer_lookup_key: true,
});
```

• Product 1: Fixed rate yearly and monthly pricing (lookup keys: yearly, monthly)
• Product 2: Usage-based yearly and monthly pricing for titan (lookup keys: titan_yearly, titan_monthly)
• Product 3: Usage-based yearly and monthly pricing for claude (lookup keys: claude_yearly, claude_monthly)
• Product 4: Usage-based yearly and monthly pricing for chatgpt (lookup keys: chatgpt_yearly, chatgpt_monthly)

The 6 model prices should be linked to the corresponding meter.id.

# Configure the Billing Customer Portal

Visit [The Customer Portal] (https://dashboard.stripe.com/test/settings/billing/portal) in your Stripe Dashboard to configure the billing portal

Test Your Setup 1. Navigate to localhost:3000. You should see a landing page with a “Sign Up” section at the bottom. 2. If the client and server are communicating properly and you’ve created your prices, you should see a price listed for each plan. 3. Clicking “Get Started” should take you to a create account page. After completing the form, you should be redirected to http://localhost:3000/sign-up?plan=<selected-plan>.

# Routes

Top-Level Routers
• /users and /chats

User Routes
• /users/register — Set up a new account
• /users/login — Start a session with express-session
• /users/manage — Redirect to the customer portal
• /users/logout — End the session

Chat Routes
• /chats — Accept text parameters and use the userId from the session to produce a response

Webhook Routes
• /webhooks — Consume events from Stripe
