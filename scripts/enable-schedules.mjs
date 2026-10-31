export function workflowsToEnable(workflows) {
  return workflows.filter((workflow) => workflow.state === 'disabled_inactivity')
}

export async function run({ github, context }) {
  const { owner, repo } = context.repo
  const workflows = await github.paginate(github.rest.actions.listRepoWorkflows, { owner, repo, per_page: 100 })
  const disabled = workflowsToEnable(workflows)
  for (const workflow of disabled) {
    await github.rest.actions.enableWorkflow({ owner, repo, workflow_id: workflow.id })
    console.log(`Enabled ${workflow.path}.`)
  }
  if (!disabled.length) console.log('No workflow was disabled for inactivity.')
}
