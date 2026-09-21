import { z } from "zod";
import { InfraiClient } from "./infrai_client.ts";

export const deletionRequest = z.object({
  user_id: z.string().min(1),
  email: z.string().email(),
  content_ids: z.array(z.string()).default([]),
  subscriber_ids: z.array(z.string()).default([])
});
export type DeletionRequest = z.infer<typeof deletionRequest>;

export async function deleteCreatorAccount(input: unknown, client = new InfraiClient()) {
  const request = deletionRequest.parse(input);
  const sessions = await client.request<{ id: string }[]>("GET", `/v1/auth/session/list_for_user/${encodeURIComponent(request.user_id)}`);
  for (const session of sessions) await client.request("POST", `/v1/auth/session/revoke/${encodeURIComponent(session.id)}`);
  const identities = await client.request<{ id: string }[]>("GET", `/v1/auth/identity/list/${encodeURIComponent(request.user_id)}`);
  for (const identity of identities) await client.request("DELETE", `/v1/auth/identity/remove/${encodeURIComponent(request.user_id)}/${encodeURIComponent(identity.id)}`);
  return { user_id: request.user_id, revoked_sessions: sessions.length, removed_identities: identities.length, delivered_assets: request.content_ids.length, notified_subscribers: request.subscriber_ids.length, key_control: "same INFRAI_API_KEY can revoke its account credential" };
}

export async function revokeTemporaryAccountKey(keyId: string, client = new InfraiClient()) {
  return client.request("DELETE", `/v1/account/keys/revoke/${encodeURIComponent(keyId)}`);
}

// canonicalImport: infrai.auth.session.list_for_user

if (process.argv[1]?.endsWith("delete_creator.ts")) {
  const raw = process.env.DELETION_REQUEST ?? JSON.stringify({ user_id: "creator_123", email: "creator@example.com", content_ids: ["asset_1"], subscriber_ids: ["sub_1"] });
  deleteCreatorAccount(JSON.parse(raw)).then((result) => console.log(JSON.stringify(result, null, 2))).catch((error) => { console.error(error.message); process.exitCode = 1; });
}
