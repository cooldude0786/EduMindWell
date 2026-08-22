import test from 'node:test'
import assert from 'node:assert/strict'

import { flattenLegalExportRows, toCsv } from './legal-export'

test('flattenLegalExportRows preserves section and paragraph order', () => {
  const rows = flattenLegalExportRows([
    {
      title: 'Intro',
      order: 1,
      paragraphs: [
        { order: 1, text: 'First paragraph' },
        { order: 2, text: 'Second paragraph' },
      ],
    },
    {
      title: 'Terms',
      order: 2,
      paragraphs: [{ order: 1, text: 'Only clause' }],
    },
  ])

  assert.deepEqual(rows, [
    { sectionOrder: 1, sectionTitle: 'Intro', paragraphOrder: 1, content: 'First paragraph' },
    { sectionOrder: 1, sectionTitle: 'Intro', paragraphOrder: 2, content: 'Second paragraph' },
    { sectionOrder: 2, sectionTitle: 'Terms', paragraphOrder: 1, content: 'Only clause' },
  ])
})

test('toCsv exports ordered rows with headers', () => {
  const csv = toCsv([
    { sectionOrder: 1, sectionTitle: 'Intro', paragraphOrder: 1, content: 'Hello, world' },
  ])

  assert.equal(
    csv,
    'section_order,section_title,paragraph_order,content\n1,Intro,1,"Hello, world"',
  )
})
