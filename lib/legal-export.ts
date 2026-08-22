export type LegalExportRow = {
  sectionOrder: number
  sectionTitle: string
  paragraphOrder: number
  content: string
}

type LegalExportSection = {
  title: string | null
  order: number
  paragraphs: Array<{
    order: number
    text: string
  }>
}

export function flattenLegalExportRows(sections: LegalExportSection[]): LegalExportRow[] {
  return [...sections]
    .sort((a, b) => a.order - b.order)
    .flatMap((section) => {
      const paragraphs = [...(section.paragraphs ?? [])].sort((a, b) => a.order - b.order)
      const sectionTitle = section.title?.trim() || 'Untitled section'

      if (paragraphs.length === 0) {
        return [{
          sectionOrder: section.order,
          sectionTitle,
          paragraphOrder: 0,
          content: '',
        }]
      }

      return paragraphs.map((paragraph) => ({
        sectionOrder: section.order,
        sectionTitle,
        paragraphOrder: paragraph.order,
        content: paragraph.text ?? '',
      }))
    })
}

export function toCsv(rows: LegalExportRow[]): string {
  const headers = ['section_order', 'section_title', 'paragraph_order', 'content']
  const csvRows = rows.map((row) => [
    row.sectionOrder,
    row.sectionTitle,
    row.paragraphOrder,
    row.content,
  ].map((value) => escapeCsvCell(String(value))).join(','))

  return [headers.join(','), ...csvRows].join('\n')
}

function escapeCsvCell(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n') || value.includes('\r')) {
    return `"${value.replace(/"/g, '""')}"`
  }

  return value
}
