# backend-br/.github

Shared workflows and taxonomy of the [backend-br](https://github.com/backend-br) repositories.

## Workflows

| Workflow | Purpose |
| --- | --- |
| `auto-assign.yml` | Assigns the maintainers in `vars.ASSIGNEES` to new issues and pull requests. |
| `validate-links.yml` | Checks links with lychee and opens an issue when one is broken. Pull requests are checked without opening issues. |
| `sync-labels.yml` | Creates and updates the labels of `taxonomy.json` in the calling repository. Labels are never deleted. |
| `enable-schedules.yml` | Enables again the workflows that GitHub disabled after 60 days without commits. |

## Usage

```yaml
jobs:
  auto-assign:
    name: Auto assign
    permissions:
      issues: write
      pull-requests: write
    uses: backend-br/.github/.github/workflows/auto-assign.yml@main
    with:
      assignment-options: 'ISSUE,PULL_REQUEST'
```

```yaml
jobs:
  validate-links:
    name: Validate links
    permissions:
      issues: write
      contents: read
    uses: backend-br/.github/.github/workflows/validate-links.yml@main
```

`validate-links.yml` accepts `build-site`, to build a pnpm site before the check, and `lychee-args`.

```yaml
jobs:
  sync-labels:
    name: Sync labels
    permissions:
      issues: write
    uses: backend-br/.github/.github/workflows/sync-labels.yml@main
```

```yaml
jobs:
  enable-schedules:
    name: Enable schedules
    permissions:
      actions: write
    uses: backend-br/.github/.github/workflows/enable-schedules.yml@main
```

## Taxonomy

`taxonomy.json` holds the levels, contract types, work models and stacks shared by
[vagas](https://github.com/backend-br/vagas) and [me-contrata](https://github.com/backend-br/me-contrata). Each entry
is a label, and its aliases are the other ways the same term is written. The forms of both repositories list the
stacks in this order, and their CI fails when they drift apart.
