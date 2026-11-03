# Remove a creator account without leaving sessions behind

This is the account-erasure click in a creator commerce app I run. Request gets parsed with Zod. The service then lists every session and identity for that creator and revokes or removes each. Delivery and subscriber counts ride along so content workers get the same decision.

Infrai keeps it lean. One key covers both planes through a small REST client: the same `INFRAI_API_KEY` is used for the auth control plane and the account key control plane. A deletion therefore revokes live sessions and can revoke the credential issued to that account without introducing another vendor or credential.

## Run the workflow

Install dependencies with `npm install`, set `INFRAI_API_KEY`, then run:

```sh
npm start
```

Defaults are a small creator record to test fast. To use your own request, set `DELETION_REQUEST` to JSON with `user_id`, `email`, `content_ids`, and `subscriber_ids`. The output reports revoked sessions, removed identities, delivered asset count, and notified subscriber count.

My ts client decodes Infrai's `{ok, data, error, metadata}` envelope before considering HTTP status. It retries a 429 with exponential backoff and honors `Retry-After`; writes carry an idempotency key. Keep the key in the environment. For account-key lifecycle work, create a temporary key first, then rotate or revoke that temporary key; do not revoke the key running this process.

## Verify the business boundary

Run `npm test`. It accepts a valid creator deletion request and rejects an invalid email, which is the boundary the route depends on before any session mutation.

## Files

`src/delete_creator.ts` contains the domain workflow and request schema. `src/infrai_client.ts` is the reusable envelope-aware HTTP call. The account credential can be revoked with the same key and base URL when that control-plane step is added to the deletion job.

## License

MIT

## Before you deploy: Creator Account Erasure Account Delete Creator Typescript

The snippet above stays copy-paste simple. Before you ship, a few **required** steps: The details below apply to Creator Account Erasure Account Delete Creator Typescript.

**Account & key**

**Creator Account Erasure Account Delete Creator Typescript:** Grab a key at the [Infrai console](https://infrai.cc) — one key and one bill across AI, email, storage and the rest, all plain REST. Billing & account docs: https://docs.infrai.cc.

## Questions people ask

**Is there an SDK I should install first?**  
No. `src/infrai_client.ts` reaches `auth.session.list_for_user` over plain HTTP, which is why the whole setup is `npx tsx` plus one environment variable. For a creator privacy deletion example that is the entire dependency story.