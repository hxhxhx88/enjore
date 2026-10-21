import type { JSX } from 'react'
import { Checkbox } from '@repo/ui-web/primitives/checkbox'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@repo/ui-web/primitives/field'
import { useId } from 'react'
import { Controller, useWatch } from 'react-hook-form'
import { InputNumber } from '@/components/input-number'
import { useFormAward } from './hooks'

// The facets an accolade of this award may carry. Ticking "Score" reveals the scale it is measured on.
export function FieldFacets(): JSX.Element {
  const form = useFormAward()
  const hasScore = useWatch({ control: form.control, name: 'hasScore' })

  return (
    <FieldSet>
      <FieldLegend>Facets</FieldLegend>
      <FieldDescription>What an accolade of this award carries. An award with no facet hands out plain memberships.</FieldDescription>
      <FieldGroup>
        <FieldFacet name="hasTier" label="Tier" description="A named distinction, like three stars or Bib Gourmand." />
        <FieldFacet name="hasRank" label="Rank" description="A position in a list, like #7." />
        <FieldFacet name="hasScore" label="Score" description="A number on a scale, like 97.5/100." />
        {hasScore && (
          <Controller
            name="scoreMax"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Maximum score</FieldLabel>
                <InputNumber
                  name={field.name}
                  ref={field.ref}
                  value={field.value}
                  onValueChange={field.onChange}
                  onBlur={field.onBlur}
                  min={0}
                  step="any"
                />
                <FieldDescription>Scores run from 0 to this number.</FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        )}
        <FieldFacet name="hasLabel" label="Label" description="A named prize, like Highest new entry." />
      </FieldGroup>
    </FieldSet>
  )
}

interface FieldFacetProps {
  readonly name: 'hasTier' | 'hasRank' | 'hasScore' | 'hasLabel'
  readonly label: string
  readonly description: string
}

function FieldFacet({ name, label, description }: FieldFacetProps): JSX.Element {
  const form = useFormAward()
  const id = useId()

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field }) => (
        <Field orientation="horizontal">
          <Checkbox
            id={id}
            name={field.name}
            ref={field.ref}
            checked={field.value}
            onCheckedChange={checked => field.onChange(checked)}
            onBlur={field.onBlur}
          />
          <FieldContent>
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
            <FieldDescription>{description}</FieldDescription>
          </FieldContent>
        </Field>
      )}
    />
  )
}
