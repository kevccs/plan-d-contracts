# Plan D Contracts Export

This folder is the copy-ready seed for the future `plan-d-contracts` package.

It currently contains:

- `openapi.yaml`
- `ui-manifest.json`
- `package.json`
- `src/client.ts`
- `src/domain.ts`
- `src/options.ts`

Recommended copy command from the mono-repo root:

```bash
cp -R repo-exports/plan-d-contracts ../plan-d-contracts
```

Once this package is published or linked locally, update both web and API imports from relative paths to:

```ts
import { createPlanDClient } from '@plan-d/contracts/client';
import { CREW_ROLES } from '@plan-d/contracts/options';
```
