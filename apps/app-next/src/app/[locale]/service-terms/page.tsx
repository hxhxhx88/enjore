import type { JSX } from 'react'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { localeSchema } from '@repo/i18n/locales'
import { AppLogo } from '@repo/ui-web/app-logo'
import Markdown from 'react-markdown'

export default async function Page({ params }: PageProps<'/[locale]/service-terms'>): Promise<JSX.Element> {
  // `dynamicParams` is off, so only known locales reach this page; parsing keeps the file path provably safe.
  const locale = localeSchema.parse((await params).locale)
  const markdown = await readFile(join(process.cwd(), 'public', 'md', `service-terms-${locale}.md`), 'utf8')

  return (
    <div className="prose container mx-auto p-4">
      <div className="mb-8">
        <AppLogo size={64} />
      </div>
      <Markdown>{markdown}</Markdown>
    </div>
  )
}
