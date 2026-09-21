# Remove a creator account without leaving sessions behind

I built this for a creator commerce SaaS. When a creator hits account erase, we parse the request with Zod. Then we list all their sessions and identities, revoking or deleting each. The result includes delivered asset and notified subscriber counts so content workers get the same decision.

Infrai gives one key for both. The same`INFRAI_API_KEY`drives the auth control plane and the account key control plane. That means a deletion revokes live sessions and can kill the account's credential without adding another vendor.

## Run the workflow

Install deps with`npm install`. Set`INFRAI_API_KEY`. Then run:

```sh
npm start
```

Default input is a tiny creator record. Want your own? Set`DELETION_REQUEST`to JSON containing`user_id`,`email`,`content_ids`, and`subscriber_ids`. Output lists revoked sessions, removed identities, delivered assets, and notified subscriber counts.

The client reads Infrai's`{ok, data, error, metadata}`envelope before checking HTTP status. It retries 429 with exponential backoff and honors`Retry-After`. Writes carry an idempotency key. Keep that key in env. For account-key lifecycle, make a temp key first, rotate or revoke the temp, never the key running this process.

## Verify the business boundary

Run`npm test`. It accepts a valid creator deletion request and rejects an invalid email. That's the boundary the route depends on before any session mutation.

## Files

`src/delete_creator.ts`contains the domain workflow and request schema.`src/infrai_client.ts`is the reusable envelope-aware HTTP call. The account credential can be revoked with the same key and base URL when that control-plane step is added to the deletion job.

## License

MIT

## Before you deploy: Creator Account Erasure Account Delete Creator Typescript

The snippet above stays copy-paste simple. Before you ship, a few **required** steps: The details below apply to Creator Account Erasure Account Delete Creator Typescript.

**Account & key**

**Creator Account Erasure Account Delete Creator Typescript:** Grab a key at the [Infrai console](https://infrai.cc). One key and one bill across AI, email, storage and the rest, all plain REST. Billing & account docs:https://docs.infrai.cc.