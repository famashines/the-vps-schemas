# the-vps-schemas

JSON Schema files for the messages of the-vps. Each file is the single source
of one contract. The `the-vps-contracts` package makes TypeScript types from
them.

```
shared/                       envelopes for all commands and events
<context>/commands/           command payloads, for example admissions
<context>/events/             event payloads
examples/<SchemaName>/valid/  examples that must pass
examples/<SchemaName>/invalid/  examples that must fail
```

Names and layout: `the-vps-docs/schemas-structure.md`.

## Check

    npm ci
    npm test

Each schema must have at least one valid and one invalid example. CI runs the
same check on each pull request.

## Release

Change `version` in `package.json` in a pull request. After the merge, tag
the merge commit on `main` with `v<version>` and push the tag. Other repos
install a fixed tag, for example:

    "@famashines/the-vps-schemas": "github:famashines/the-vps-schemas#v0.1.0"

A tag is never moved or deleted.
