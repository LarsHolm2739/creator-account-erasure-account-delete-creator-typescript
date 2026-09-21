import assert from "node:assert/strict";
import { deletionRequest } from "./delete_creator.ts";

const parsed = deletionRequest.parse({ user_id: "u1", email: "u@example.com", content_ids: ["asset"], subscriber_ids: [] });
assert.equal(parsed.user_id, "u1");
assert.throws(() => deletionRequest.parse({ user_id: "u1", email: "bad" }));
console.log("deletion request boundary passes");
