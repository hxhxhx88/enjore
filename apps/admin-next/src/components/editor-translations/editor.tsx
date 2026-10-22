'use client'

import type { JSX } from 'react'
import type { ActionOutput } from '@/lib/action-output'
import type { MountedTranslationTable } from '@/lib/translations'
import { localeTagSchema } from '@repo/lib/schemas/locale-tag'
import { LoadingButton } from '@repo/ui-web/loading-button'
import { Badge } from '@repo/ui-web/primitives/badge'
import { Button } from '@repo/ui-web/primitives/button'
import { Input } from '@repo/ui-web/primitives/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@repo/ui-web/primitives/table'
import { toast } from '@repo/ui-web/primitives/toast'
import { useMutation } from '@tanstack/react-query'
import { useId, useState } from 'react'
import { localeTagSuggestions } from '@/lib/locales'
import { actionTranslationDelete } from './action-translation-delete'
import { actionTranslationUpsert } from './action-translation-upsert'
import { ModalTranslationDelete } from './modal-translation-delete'

export interface TranslationRow {
  id: string
  locale: string
  value: string
}

interface Props {
  readonly table: MountedTranslationTable
  readonly recordId: string
  readonly field: string
  // The value the record itself holds, in its native locale.
  readonly canonical: { value: string, locale: string }
  readonly rows: readonly TranslationRow[]
  // Swaps a row with the canonical value; offered for names, where the record can hold any of its locales.
  readonly onMakeCanonical?: ((locale: string) => Promise<ActionOutput>) | undefined
}

type Editing
  = | { type: 'add' }
    | { type: 'edit', row: TranslationRow }

// One row per locale of one field, edited in place: add, edit, delete and "Make canonical". The page's props carry
// the rows, and every action revalidates the page, so the editor keeps only what is being typed.
export function EditorTranslations({ table, recordId, field, canonical, rows, onMakeCanonical }: Props): JSX.Element {
  const [editing, setEditing] = useState<Editing | undefined>(undefined)
  const [deleting, setDeleting] = useState<TranslationRow | undefined>(undefined)
  const [locale, setLocale] = useState('')
  const [value, setValue] = useState('')
  const [error, setError] = useState<string | undefined>(undefined)
  const listId = useId()

  const upsert = useMutation({
    mutationFn: actionTranslationUpsert,
    onSuccess(output) {
      switch (output.type) {
        case 'ok': {
          toast.add({ type: 'success', title: 'Translation saved.' })
          setEditing(undefined)
          break
        }
        case 'bad': {
          toast.add({ type: 'warning', title: output.message })
          break
        }
      }
    },
  })

  const swap = useMutation({
    mutationFn: async (swapLocale: string) => {
      if (onMakeCanonical === undefined) {
        throw new Error('This field has no canonical swap.')
      }
      return onMakeCanonical(swapLocale)
    },
    onSuccess(output) {
      switch (output.type) {
        case 'ok': {
          toast.add({ type: 'success', title: 'Canonical name swapped.' })
          break
        }
        case 'bad': {
          toast.add({ type: 'warning', title: output.message })
          break
        }
      }
    },
  })

  function startEditing(next: Editing): void {
    setEditing(next)
    setLocale(next.type === 'edit' ? next.row.locale : '')
    setValue(next.type === 'edit' ? next.row.value : '')
    setError(undefined)
  }

  function save(): void {
    const trimmedLocale = locale.trim()
    const trimmedValue = value.trim()
    const taken = rows.some(row => row.locale === trimmedLocale && !(editing?.type === 'edit' && editing.row.locale === trimmedLocale))
    if (!localeTagSchema.safeParse(trimmedLocale).success) {
      setError('Use a lowercase BCP 47 tag like en-us or zh-hk.')
      return
    }
    if (trimmedLocale === canonical.locale) {
      setError(`${trimmedLocale} is the locale of the canonical value.`)
      return
    }
    if (taken) {
      setError(`A translation in ${trimmedLocale} already exists; edit that row.`)
      return
    }
    if (trimmedValue === '') {
      setError('Enter the translated value.')
      return
    }
    setError(undefined)
    upsert.mutate({ table, recordId, field, locale: trimmedLocale, value: trimmedValue })
  }

  // The cells of the row being added or edited; the same three cells replace an existing row or end the table.
  const editorCells = (
    <>
      <TableCell className="align-top">
        <Input
          value={locale}
          list={listId}
          placeholder="en-us"
          aria-label="Locale"
          className="w-28"
          onChange={event => setLocale(event.target.value)}
        />
        <datalist id={listId}>
          {localeTagSuggestions.map(tag => <option key={tag} value={tag} />)}
        </datalist>
      </TableCell>
      <TableCell className="align-top">
        <Input
          value={value}
          aria-label="Translated value"
          onChange={event => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              save()
            }
          }}
        />
        {error !== undefined && <p className="mt-1 text-xs text-destructive">{error}</p>}
      </TableCell>
      <TableCell className="align-top">
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setEditing(undefined)}>
            Cancel
          </Button>
          <LoadingButton size="sm" isLoading={upsert.isPending} onClick={save}>
            Save
          </LoadingButton>
        </div>
      </TableCell>
    </>
  )

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-hidden border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-32">Locale</TableHead>
              <TableHead>Value</TableHead>
              <TableHead className="w-64" />
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <code className="font-mono text-xs">{canonical.locale}</code>
              </TableCell>
              <TableCell>{canonical.value}</TableCell>
              <TableCell className="text-right">
                <Badge variant="secondary">Canonical</Badge>
              </TableCell>
            </TableRow>
            {rows.map(row => editing?.type === 'edit' && editing.row.id === row.id
              ? <TableRow key={row.id}>{editorCells}</TableRow>
              : (
                  <TableRow key={row.id}>
                    <TableCell>
                      <code className="font-mono text-xs">{row.locale}</code>
                    </TableCell>
                    <TableCell>{row.value}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        {onMakeCanonical !== undefined && (
                          <LoadingButton
                            variant="outline"
                            size="sm"
                            isLoading={swap.isPending && swap.variables === row.locale}
                            onClick={() => swap.mutate(row.locale)}
                          >
                            Make canonical
                          </LoadingButton>
                        )}
                        <Button variant="outline" size="sm" onClick={() => startEditing({ type: 'edit', row })}>
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setDeleting(row)}>
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            {editing?.type === 'add' && <TableRow>{editorCells}</TableRow>}
          </TableBody>
        </Table>
      </div>
      {editing === undefined && (
        <Button variant="outline" className="w-fit" onClick={() => startEditing({ type: 'add' })}>
          Add translation
        </Button>
      )}
      {deleting !== undefined && (
        <ModalTranslationDelete
          row={deleting}
          onConfirm={async () => actionTranslationDelete({ table, recordId, field, locale: deleting.locale })}
          onClose={() => setDeleting(undefined)}
        />
      )}
    </div>
  )
}
