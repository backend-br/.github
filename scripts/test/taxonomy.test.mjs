import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { workflowsToEnable } from '../enable-schedules.mjs'
import { labelChanges, labelsOf } from '../sync-labels.mjs'

const taxonomy = JSON.parse(readFileSync(new URL('../../taxonomy.json', import.meta.url)))
const FACETS = ['levels', 'contracts', 'workModels', 'stacks']

test('every taxonomy entry has a name, a description, a hex color and aliases', () => {
  for (const facet of FACETS) {
    assert.ok(taxonomy[facet].length > 0, facet)
    for (const entry of taxonomy[facet]) {
      assert.match(entry.name, /\S/)
      assert.match(entry.description, /\S/)
      assert.match(entry.color, /^[0-9a-f]{6}$/i, entry.name)
      assert.ok(Array.isArray(entry.aliases), entry.name)
    }
  }
})

test('names and aliases are unique across the whole taxonomy', () => {
  const seen = new Set()
  for (const facet of FACETS) {
    for (const entry of taxonomy[facet]) {
      for (const term of [entry.name, ...entry.aliases]) {
        const key = term.toLowerCase()
        assert.ok(!seen.has(key), `${term} is repeated`)
        seen.add(key)
      }
    }
  }
})

test('stacks are sorted by name so the forms list them in the same order', () => {
  const names = taxonomy.stacks.map((stack) => stack.name)
  const sorted = [...names].sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }))
  assert.deepEqual(names, sorted)
})

test('labels are created when missing and updated when they differ', () => {
  const wanted = labelsOf({
    levels: [{ name: 'Pleno', description: 'Nível de experiência.', color: '54B890' }],
    contracts: [{ name: 'PJ', description: 'Tipo de contratação.', color: 'cdeadc' }],
    workModels: [],
    stacks: [{ name: 'Redis', description: 'Banco de dados.', color: 'dc382d' }],
  })
  const existing = [
    { name: 'Pleno', description: 'Nível de experiência.', color: '54B890' },
    { name: 'pj', description: null, color: 'cdeadc' },
  ]

  const changes = labelChanges(wanted, existing)

  assert.deepEqual(
    changes.map(({ action, label }) => [action, label.name]),
    [
      ['update', 'PJ'],
      ['create', 'Redis'],
    ],
  )
  assert.equal(changes[0].current, 'pj')
})

test('only workflows disabled for inactivity are enabled again', () => {
  const workflows = [
    { id: 1, state: 'active' },
    { id: 2, state: 'disabled_inactivity' },
    { id: 3, state: 'disabled_manually' },
  ]

  assert.deepEqual(
    workflowsToEnable(workflows).map((workflow) => workflow.id),
    [2],
  )
})
