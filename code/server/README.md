## Requirements
- Install Node v18
- Install the [Stripe CLI](https://stripe.com/docs/stripe-cli#install)

## How to run

1. Install dependencies

```
. install.sh
```

2. After installing the Stripe CLI and logging in with your test account, start a local listener to get your webhook secret:

```
stripe listen --forward-to 127.0.0.1:4242/webhook
```

3. Copy `.env.example` to `.env`, then add your testmode Stripe API keys from the [Dashboard](https://dashboard.stripe.com/test/apikeys) and the webhook secret from the CLI


4. Start the server

```
. start.sh
```

5. Go to `127.0.0.1:4242` in your browser, unless you're running a React client, in which case start it from the client directory and then visit `127.0.0.1:3000`.

_Note: Explicitly running on 127.0.0.1 ensures that all of our languages use IPv4, even as the /etc/hosts file varies across systems._