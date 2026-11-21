import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { authorize } from "./policy-engine.ts";
import { status } from "./routes/status.ts";

const contract = readFileSync(new URL("../openapi.json", import.meta.url));
export function service(key: string, organization: string) {
  return createServer((req, res) => {
    res.setHeader("Content-Type", "application/json");
    const path = req.url?.split("?")[0];
    if (req.method === "GET" && path === "/openapi.json") return res.end(contract);
    if (!authorize(req.headers["x-api-key"], req.headers["x-organization-id"], key, organization)) {
      res.writeHead(403).end(JSON.stringify({error: "Scope denied"}));
    } else if (req.method === "GET" && path === "/v1/status/summary") {
      res.end(JSON.stringify(status(organization)));
    } else {
      res.writeHead(404).end(JSON.stringify({error: "Unknown route"}));
    }
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  service(process.env.BKIT_KEY ?? "", process.env.BKIT_ORG ?? "").listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
}
