// Forms hold `''` where the database holds `null`; these two map between them at the form's boundary.
export function emptyToNull(value: string): string | null {
  const trimmed = value.trim()
  return trimmed === '' ? null : trimmed
}

export function nullToEmpty(value: string | null): string {
  return value ?? ''
}
