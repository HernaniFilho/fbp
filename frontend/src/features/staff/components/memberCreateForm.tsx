import { useForm } from '@tanstack/react-form'
import {
  type MemberCreate,
  type Sex,
  type Age,
  type Handedness,
  type ParanormalEventType,
  memberCreateSchema,
  SEX,
  SEX_LABELS,
  AGE_SPECIAL_VALUES,
  AGE_SPECIAL_LABELS,
} from '../schemas/staff'
import { Label } from '#/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { Input } from '#/components/ui/input'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '#/components/ui/field'

const defaultMember: MemberCreate = {
  name: '',
  sex: 'n/a' satisfies Sex,
  age: 0 satisfies Age,
  handedness: 'n/a' satisfies Handedness,
  hasParanormalParent: false,
  numberOfMissions: 0,
  serviceTime: 0,
  hadParanormalEvent: false,
  ageOfFirstParanormalEvent: 0 satisfies Age,
  typeOfFirstParanormalEvent: 'n/a' satisfies ParanormalEventType,
  paranormalLevel: 0,
}

export default function MemberCreateForm() {
  const form = useForm({
    defaultValues: defaultMember,
    onSubmit: async ({ value }) => {
      // TODO: send values to server
      console.log(value)
    },
    validators: {
      onBlur: memberCreateSchema,
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="flex flex-col gap-4"
    >
      {/* ---- Biological ---- */}
      <FieldSet>
        <FieldLegend className="text-destructive font-bold uppercase">
          Biological
        </FieldLegend>
        <FieldDescription>
          Biological information of the member
        </FieldDescription>
        <FieldGroup>
          {/* name */}
          <form.Field name="name">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field>

          {/* sex */}
          <form.Field name="sex">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field orientation="responsive" data-invalid={isInvalid}>
                  <FieldContent>
                    <FieldLabel htmlFor={field.name}>Sex</FieldLabel>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </FieldContent>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value as Sex)}
                  >
                    <SelectTrigger
                      id={field.name}
                      onBlur={field.handleBlur}
                      aria-invalid={isInvalid}
                      className="min-w-30"
                    >
                      <SelectValue placeholder="Select one..." />
                    </SelectTrigger>
                    <SelectContent>
                      {SEX.options.map((value) => (
                        <SelectItem key={value} value={value}>
                          {SEX_LABELS[value]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )
            }}
          </form.Field>

          {/* age */}
          <form.Field name="age">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              const value = field.state.value
              const mode = typeof value === 'number' ? 'number' : value

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Age</FieldLabel>
                  <div className="flex flex-row gap-2">
                    <Select
                      value={mode}
                      onValueChange={(newMode) => {
                        if (newMode === 'number') {
                          field.handleChange(0)
                        } else {
                          field.handleChange(newMode as 'n/a' | 'inf')
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="number">Number</SelectItem>
                        {AGE_SPECIAL_VALUES.map((special) => (
                          <SelectItem key={special} value={special}>
                            {AGE_SPECIAL_LABELS[special]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {mode === 'number' && (
                      <Input
                        id={field.name}
                        type="number"
                        min={0}
                        value={value}
                        onChange={(e) =>
                          field.handleChange(Number(e.target.value))
                        }
                        onBlur={field.handleBlur}
                        aria-invalid={isInvalid}
                      />
                    )}
                  </div>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field>
        </FieldGroup>
      </FieldSet>

      {/* ---- Exposure ---- */}
      <FieldSet>
        <FieldLegend className="text-destructive font-bold uppercase">
          Exposure
        </FieldLegend>
        <FieldDescription>
          Exposure information of the member on service
        </FieldDescription>
        <FieldGroup>{/* TODO: exposure */}</FieldGroup>
      </FieldSet>

      {/* ---- Paranormal events ---- */}
      <FieldSet>
        <FieldLegend className="text-destructive font-bold uppercase">
          Paranormal events
        </FieldLegend>
        <FieldDescription>
          Paranormal events affecting the member
        </FieldDescription>
        <FieldGroup>{/* TODO: paranormal events */}</FieldGroup>
      </FieldSet>
    </form>
  )
}
