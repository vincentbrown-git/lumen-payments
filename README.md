# lumen-payments

The **payments** microservice for Lumen, a SaaS invoicing app for freelancers.

In the full product, this service owns:
- Creating Stripe Checkout sessions for invoice payment
- Recording payment results (succeeded / failed / refunded)
- Handling Stripe webhooks
- Issuing refunds

This starter has just two endpoints so the deploy pipeline is the focus.

## Endpoints

- `GET  /health` — health check used by Kubernetes probes
- `GET  /payments/:id` — fetch a (fake) payment record
- `POST /payments` — create a (fake) payment, body: `{ "invoiceId": "...", "amount": 4200 }`

## Run locally

```bash
npm install
npm start
# in another terminal
curl localhost:8080/health
```

## Run in Docker

```bash
docker build -t lumen-payments:local .
docker run -p 8080:8080 lumen-payments:local
```

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which:
1. Installs deps and runs tests
2. Builds the Docker image and pushes to Docker Hub
3. Authenticates to AWS and updates the EKS kubeconfig
4. Applies `k8s/` manifests and rolls out the new image tag

### Required GitHub secrets

- `DOCKERHUB_USER`
- `DOCKERHUB_TOKEN`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

### One-time setup before the first deploy

```bash
# Create the cluster
eksctl create cluster --name lumen-cluster --region us-east-1 --nodes 2

# Verify access from your machine
aws eks update-kubeconfig --name lumen-cluster --region us-east-1
kubectl get nodes
```

Also: edit `k8s/deployment.yaml` and replace `YOUR_DOCKERHUB_USER` with your actual Docker Hub username.

## After deploy

```bash
kubectl get svc payments
# copy the EXTERNAL-IP / DNS name and curl it
curl http://<elb-dns-name>/health
```
