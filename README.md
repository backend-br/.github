# backend-br/.github

Shared workflows of the [backend-br](https://github.com/backend-br) repositories.

## Workflows

| Workflow | Purpose |
| --- | --- |
| `auto-assign.yml` | Assigns the maintainers in `vars.ASSIGNEES` to new issues and pull requests. |
| `validate-links.yml` | Checks links with lychee and opens an issue when one is broken. Pull requests are checked without opening issues. |

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
