import { readFileSync } from 'node:fs'

const FACETS = ['levels', 'contracts', 'workModels', 'stacks']

export function labelsOf(taxonomy) {
  return FACETS.flatMap((facet) => taxonomy[facet]).map(({ name, description, color }) => ({
    name,
    description,
    color: color.toLowerCase(),
  }))
}

export function labelChanges(wanted, existing) {
  const existingByName = new Map(existing.map((label) => [label.name.toLowerCase(), label]))
  const changes = []
  for (const label of wanted) {
    const current = existingByName.get(label.name.toLowerCase())
    if (!current) changes.push({ action: 'create', label })
    else if (
      current.name !== label.name ||
      (current.description ?? '') !== label.description ||
      current.color.toLowerCase() !== label.color
    )
      changes.push({ action: 'update', current: current.name, label })
  }
  return changes
}

export async function run({ github, context, taxonomyFile, isDryRun }) {
  const { owner, repo } = context.repo
  const wanted = labelsOf(JSON.parse(readFileSync(taxonomyFile)))
  const existing = await github.paginate(github.rest.issues.listLabelsForRepo, { owner, repo, per_page: 100 })
  const changes = labelChanges(wanted, existing)
  for (const change of changes) {
    console.log(`${change.action} ${change.label.name}`)
    if (isDryRun) continue
    if (change.action === 'create') await github.rest.issues.createLabel({ owner, repo, ...change.label })
    else
      await github.rest.issues.updateLabel({
        owner,
        repo,
        name: change.current,
        new_name: change.label.name,
        description: change.label.description,
        color: change.label.color,
      })
  }
  console.log(`${changes.length} labels to change, out of ${wanted.length}.`)
}
