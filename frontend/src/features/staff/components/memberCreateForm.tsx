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
  HANDEDNESS,
  HANDEDNESS_LABELS,
  PARANORMAL_EVENT_TYPE,
  PARANORMAL_EVENT_TYPE_LABELS,
} from '../schemas/staff'
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
  FieldSeparator,
  FieldSet,
} from '#/components/ui/field'
import { Checkbox } from '#/components/ui/checkbox'
import { Button } from '#/components/ui/button'
import { Spinner } from '#/components/ui/spinner'
import { createStaffMember, useCreateStaffMember } from '../service/staff'

const defaultMember: MemberCreate = {
  name: '',
  sex: 'not_specified' satisfies Sex,
  age: 18 satisfies Age,
  handedness: 'not_specified' satisfies Handedness,
  hasParanormalParent: false,
  numberOfMissions: 0,
  serviceTime: 0,
  hadParanormalEvent: false,
}

export default function MemberCreateForm() {
  const { mutateAsync } = useCreateStaffMember()

  const form = useForm({
    defaultValues: defaultMember,
    onSubmit: async ({ value }) => {
      try {
        const result = await mutateAsync(value)

        console.log('Staff member created:', result)
        form.reset()
      } catch (error) {
        console.error('Error creating staff member:', error)
      }
    },
    validators: {
      onBlur: memberCreateSchema,
      onChange: memberCreateSchema,
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="flex flex-col mb-4 gap-4"
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
                    placeholder="Name of staff member"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    aria-invalid={isInvalid}
                    className="rounded-none"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field>

          {/* Sex, Age, Handedness */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* sex */}
            <form.Field name="sex">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldContent>
                      <FieldLabel htmlFor={field.name}>Sex</FieldLabel>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </FieldContent>
                    <Select
                      value={field.state.value}
                      onValueChange={(value) =>
                        field.handleChange(value as Sex)
                      }
                    >
                      <SelectTrigger
                        id={field.name}
                        onBlur={field.handleBlur}
                        aria-invalid={isInvalid}
                        className="min-w-30 rounded-none"
                      >
                        <SelectValue placeholder="Select one..." />
                      </SelectTrigger>
                      <SelectContent className="rounded-none">
                        {SEX.options.map((value) => (
                          <SelectItem
                            key={value}
                            value={value}
                            className="rounded-none"
                          >
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
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldContent>
                      <FieldLabel htmlFor={field.name}>Age</FieldLabel>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </FieldContent>
                    <Input
                      id={field.name}
                      type="number"
                      min={0}
                      value={field.state.value ? Number(field.state.value) : 18}
                      onChange={(e) =>
                        field.handleChange(Number(e.target.value))
                      }
                      onBlur={field.handleBlur}
                      aria-invalid={isInvalid}
                      className="rounded-none"
                    />
                  </Field>
                )
              }}
            </form.Field>

            {/** Handedness */}
            <form.Field name="handedness">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldContent>
                      <FieldLabel htmlFor={field.name}>Handedness</FieldLabel>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </FieldContent>
                    <Select
                      value={field.state.value}
                      onValueChange={(value) =>
                        field.handleChange(value as Handedness)
                      }
                    >
                      <SelectTrigger
                        id={field.name}
                        onBlur={field.handleBlur}
                        aria-invalid={isInvalid}
                        className="min-w-30 rounded-none"
                      >
                        <SelectValue placeholder="Select one..." />
                      </SelectTrigger>
                      <SelectContent className="rounded-none">
                        {HANDEDNESS.options.map((value) => (
                          <SelectItem
                            key={value}
                            value={value}
                            className="rounded-none"
                          >
                            {HANDEDNESS_LABELS[value]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )
              }}
            </form.Field>
          </div>

          {/** Paranormal Parent */}
          <form.Field name="hasParanormalParent">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field orientation="horizontal" data-invalid={isInvalid}>
                  <Checkbox
                    id={field.name}
                    name={field.name}
                    checked={field.state.value}
                    onCheckedChange={(checked) =>
                      field.handleChange(checked === true)
                    }
                    aria-invalid={isInvalid}
                    className="rounded-none"
                  />
                  <FieldContent>
                    <FieldLabel htmlFor={field.name}>
                      Paranormal Parent
                    </FieldLabel>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </FieldContent>
                </Field>
              )
            }}
          </form.Field>
        </FieldGroup>
      </FieldSet>

      <FieldSeparator />
      {/* ---- Exposure ---- */}
      <FieldSet>
        <FieldLegend className="text-destructive font-bold uppercase">
          Exposure
        </FieldLegend>
        <FieldDescription>
          Exposure information of the member on service
        </FieldDescription>
        <FieldGroup>
          {/* Number of Missions, Service time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Number of Missions */}
            <form.Field name="numberOfMissions">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldContent>
                      <FieldLabel htmlFor={field.name}>
                        Number of Missions
                      </FieldLabel>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </FieldContent>
                    <Input
                      id={field.name}
                      type="number"
                      min={0}
                      value={field.state.value}
                      onChange={(e) =>
                        field.handleChange(Number(e.target.value))
                      }
                      onBlur={field.handleBlur}
                      aria-invalid={isInvalid}
                      className="rounded-none"
                    />
                  </Field>
                )
              }}
            </form.Field>

            {/* Service time */}
            <form.Field name="serviceTime">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldContent>
                      <FieldLabel htmlFor={field.name}>Service time</FieldLabel>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </FieldContent>
                    <Input
                      id={field.name}
                      type="number"
                      min={0}
                      value={field.state.value}
                      onChange={(e) =>
                        field.handleChange(Number(e.target.value))
                      }
                      onBlur={field.handleBlur}
                      aria-invalid={isInvalid}
                      className="rounded-none"
                    />
                  </Field>
                )
              }}
            </form.Field>
          </div>
        </FieldGroup>
      </FieldSet>

      <FieldSeparator />
      {/* ---- Paranormal events ---- */}
      <FieldSet>
        <FieldLegend className="text-destructive font-bold uppercase">
          Paranormal events
        </FieldLegend>
        <FieldDescription>
          Paranormal events affecting the member
        </FieldDescription>
        <FieldGroup>
          {/* Paranormal Level */}
          <form.Field name="paranormalLevel">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldContent>
                    <FieldLabel htmlFor={field.name}>
                      Paranormal Level
                    </FieldLabel>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </FieldContent>
                  <Input
                    id={field.name}
                    type="number"
                    min={0}
                    value={field.state.value ?? ''}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    onBlur={field.handleBlur}
                    aria-invalid={isInvalid}
                    className="rounded-none"
                  />
                </Field>
              )
            }}
          </form.Field>

          {/* hadParanormalEvent */}
          <form.Field name="hadParanormalEvent">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field orientation="horizontal" data-invalid={isInvalid}>
                  <Checkbox
                    id={field.name}
                    name={field.name}
                    checked={field.state.value}
                    onCheckedChange={(checked) => {
                      field.handleChange(checked === true)
                      // limpa os campos dependentes ao desmarcar
                      if (!checked) {
                        form.setFieldValue(
                          'ageOfFirstParanormalEvent',
                          undefined,
                        )
                        form.setFieldValue(
                          'typeOfFirstParanormalEvent',
                          undefined,
                        )
                      }
                    }}
                    aria-invalid={isInvalid}
                    className="rounded-none"
                  />
                  <FieldContent>
                    <FieldLabel htmlFor={field.name}>
                      Had Paranormal Event
                    </FieldLabel>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </FieldContent>
                </Field>
              )
            }}
          </form.Field>

          {/* campos liberados apenas se hadParanormalEvent === true */}
          <form.Subscribe selector={(state) => state.values.hadParanormalEvent}>
            {(hadParanormalEvent) =>
              hadParanormalEvent && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                  {/* ageOfFirstParanormalEvent */}
                  <form.Field name="ageOfFirstParanormalEvent">
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldContent>
                            <FieldLabel htmlFor={field.name}>
                              Age of First Event
                            </FieldLabel>
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </FieldContent>
                          <Input
                            id={field.name}
                            type="number"
                            min={0}
                            value={field.state.value ?? ''}
                            onChange={(e) =>
                              field.handleChange(Number(e.target.value))
                            }
                            onBlur={field.handleBlur}
                            aria-invalid={isInvalid}
                            className="rounded-none"
                          />
                        </Field>
                      )
                    }}
                  </form.Field>

                  {/* typeOfFirstParanormalEvent */}
                  <form.Field name="typeOfFirstParanormalEvent">
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>
                            Type of First Event
                          </FieldLabel>
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                          <Select
                            value={field.state.value ?? ''}
                            onValueChange={(value) =>
                              field.handleChange(value as ParanormalEventType)
                            }
                          >
                            <SelectTrigger
                              id={field.name}
                              onBlur={field.handleBlur}
                              aria-invalid={isInvalid}
                              className="rounded-none"
                            >
                              <SelectValue placeholder="Select one..." />
                            </SelectTrigger>
                            <SelectContent className="rounded-none">
                              {PARANORMAL_EVENT_TYPE.options.map((value) => (
                                <SelectItem
                                  key={value}
                                  value={value}
                                  className="rounded-none"
                                >
                                  {PARANORMAL_EVENT_TYPE_LABELS[value]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </Field>
                      )
                    }}
                  </form.Field>
                </div>
              )
            }
          </form.Subscribe>
        </FieldGroup>
      </FieldSet>
      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <Button
            type="submit"
            disabled={!canSubmit}
            variant="secondary"
            className="rounded-none"
          >
            {isSubmitting ? (
              <span>
                <Spinner /> Submitting...
              </span>
            ) : (
              <span>Submit</span>
            )}
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}
