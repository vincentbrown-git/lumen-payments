// Lumen — payments microservice
// Owns: creating payment intents, recording payment results, refunds.
// In production this would talk to Stripe and a Postgres database.

const express = require('express');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8080;

// Health check — Kubernetes hits this every few seconds via the readiness/liveness probes.
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'payments' });
});

// Fake "look up a payment" endpoint.
// Real version: SELECT * FROM payments WHERE id = $1
app.get('/payments/:id', (req, res) => {
  res.json({
    id: req.params.id,
    invoiceId: 'inv_123',
    amount: 4200,        // cents, like Stripe
    currency: 'USD',
    status: 'succeeded',
  });
});

// Fake "create a payment" endpoint.
// Real version: create a Stripe Checkout session, store a row, return the URL.
app.post('/payments', (req, res) => {
  const { invoiceId, amount, currency = 'USD' } = req.body || {};
  if (!invoiceId || !amount) {
    return res.status(400).json({ error: 'invoiceId and amount are required' });
  }
  res.status(201).json({
    id: `pay_${Date.now()}`,
    invoiceId,
    amount,
    currency,
    status: 'pending',
    checkoutUrl: 'https://checkout.stripe.com/fake-session',
  });
});

app.listen(PORT, () => {
  console.log(`[payments] listening on :${PORT}`);
});
