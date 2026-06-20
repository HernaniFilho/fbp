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
      {/* name */}
      <form.Field name="name">
        {(field) => {
          const { errors, isTouched } = field.state.meta
          return (
            <div className="flex flex-col gap-2">
              <Label htmlFor={field.name}>Name</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
              {isTouched && errors.length > 0 && <em>{errors[0]?.message}</em>}
            </div>
          )
        }}
      </form.Field>

      {/* sex */}
      <form.Field name="sex">
        {(field) => {
          const { errors, isTouched } = field.state.meta
          return (
            <div className="flex flex-col gap-2">
              <Label htmlFor={field.name}>Sex</Label>
              <Select
                value={field.state.value}
                onValueChange={(value) => field.handleChange(value as Sex)}
              >
                <SelectTrigger id={field.name} onBlur={field.handleBlur}>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {SEX.options.map((value) => (
                    <SelectItem key={value} value={value}>
                      {SEX_LABELS[value]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isTouched && errors.length > 0 && <em>{errors[0]?.message}</em>}
            </div>
          )
        }}
      </form.Field>

      {/* age */}
      <form.Field name="age">
        {(field) => {
          const { errors, isTouched } = field.state.meta
          const value = field.state.value

          const mode = typeof value === 'number' ? 'number' : value

          return (
            <div className="flex flex-col gap-2">
              <Label htmlFor={field.name}>Age</Label>
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
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    onBlur={field.handleBlur}
                  />
                )}
              </div>
              {isTouched && errors.length > 0 && <em>{errors[0]?.message}</em>}
            </div>
          )
        }}
      </form.Field>
    </form>
  )
}
