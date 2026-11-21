# BoundaryKit middleware

Use Node 22.18 or later. Run `npm ci`, `npm run check`, and `node --test`. Set `BKIT_KEY` and `BKIT_ORG`, then run `npm start`. The local service exposes the OpenAPI contract and a scoped GET /v1/status/summary route. Other contract operations are documentation fixtures.

The docs-sync workflow uses DOCS_SYNC_TOKEN with contents write access to boundarykit/docs-kestrel. A push to main or a manual dispatch refreshes the documentation.
