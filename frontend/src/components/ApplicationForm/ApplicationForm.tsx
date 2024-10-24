import React, { useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { IApplicationForm } from "../../applicationForm/types"
import styles from "./ApplicationForm.module.css"

export const ApplicationForm: React.FC = ({}) => {
  const {
    register,
    control,
    handleSubmit,

    formState: { errors },
  } = useForm<IApplicationForm>({
    defaultValues: {
      name: "",
      description: "",
      questions: [
        { title: "", responseType: 0 },
        { title: "", responseType: 0 },
        { title: "", responseType: 0 },
        { title: "", responseType: 0 },
        { title: "", responseType: 0 },
      ],
    },
    mode: "onBlur",
  })

  const [formData, setFormData] = useState<IApplicationForm>()

  const { fields, append, remove } = useFieldArray({
    name: "questions",
    control,
  })

  const onSubmit = (data: IApplicationForm) => {
    /*     data.questions.forEach((question, i) => (question.id = `question_${i}`))
     */
    console.log(data)

    setFormData(data)
  }

  console.log(errors)

  return (
    <div style={{ width: "100%" }}>
      <form onSubmit={(event) => void handleSubmit(onSubmit)(event)} className={styles["form"]}>
        <label htmlFor="name">Hakemuksen nimi</label>
        <input {...register("name", { required: true })} placeholder="Kirjoita hakemuksen nimi" />
        {errors.name && <span>Pakollinen kenttä</span>}
        <label htmlFor="description">Hakemuksen kuvaus</label>

        <textarea
          {...register("description", { required: true })}
          placeholder="Kirjoita hakemuksen kuvaus"
        />
        {errors.description && <span>Pakollinen kenttä</span>}

        <div>
          Kysymykset
          {fields.map((_question, i) => (
            <div key={`question_${i}`}>
              <label htmlFor="question_name">Kysymyksen nimi</label>
              <div className={styles["question-area"]}>
                <input {...register(`questions.${i}.title`, { required: true, maxLength: 50 })} />
                <button type="button" onClick={() => remove(i)}>
                  Poista
                </button>
              </div>
              {errors.questions && errors.questions[i]?.title?.type === "required" && (
                <span>Pakollinen kenttä</span>
              )}
            </div>
          ))}
        </div>
        <div>
          <button onClick={() => append({ title: "", responseType: 0 })}>Lisää kysymys</button>
        </div>

        <button type="submit">Tallenna hakemus</button>
      </form>
      <div>
        <div>Hakemuksen nimi: {formData?.name}</div>
        <div>Hakemuksen kuvays: {formData?.description}</div>
        <div>
          Kysymykset:
          {formData?.questions.map((question) => <div>{question.title}</div>)}
        </div>
      </div>
    </div>
  )
}
