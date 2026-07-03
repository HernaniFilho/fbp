import { useForm } from '@tanstack/react-form'
import {
  HANDEDNESS,
  HANDEDNESS_LABELS,
  memberUpdateSchema,
  PARANORMAL_EVENT_TYPE,
  PARANORMAL_EVENT_TYPE_LABELS,
  SEX,
  SEX_LABELS,
  type Handedness,
  type Member,
  type MemberUpdate,
  type ParanormalEventType,
  type Sex,
} from '../schemas/staff'
import { useUpdateStaffMember } from '../service/staffService'
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
import { Input } from '#/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { Checkbox } from '#/components/ui/checkbox'
import { Button } from '#/components/ui/button'
import { Spinner } from '#/components/ui/spinner'

type MemberEditFormProps = {
  member: Member
  onSubmit: () => void
}

export default function MemberEditForm({
  member,
  onSubmit,
}: MemberEditFormProps) {
  const { mutateAsync: updateStaffMember } = useUpdateStaffMember()

  const defaultValue: MemberUpdate = {
    id: member.id,
    sex: member.sex,
    age: member.age,
    handedness: member.handedness,
    hasParanormalParent: member.hasParanormalParent,
    numberOfMissions: member.numberOfMissions,
    serviceTime: member.serviceTime,
    hadParanormalEvent: member.hadParanormalEvent,
    ageOfFirstParanormalEvent: member.ageOfFirstParanormalEvent,
    typeOfFirstParanormalEvent: member.typeOfFirstParanormalEvent,
    paranormalLevel: member.paranormalLevel,
  }

  const form = useForm({
    defaultValues: defaultValue,
    onSubmit: async ({ value }) => {
      const result = await updateStaffMember(value)
      console.log('Staff member updated:', result)
      onSubmit()
      form.reset()
    },
    validators: {
      onBlur: memberUpdateSchema,
      onChange: memberUpdateSchema,
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
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              id="name"
              name="name"
              value={member.name}
              className="rounded-none text-primary font-semibold"
              disabled
            />
          </Field>

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
