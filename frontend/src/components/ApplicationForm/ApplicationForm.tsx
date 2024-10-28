import React, { useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { ApplicationState, IApplicationForm, ResponseType } from "../../applicationForm/types"
import { Button } from "../Button/Button"
import styles from "./ApplicationForm.module.css"
import { ApplicationFormTable } from "./ApplicationFormTable"

export const ApplicationForm: React.FC = () => {
  const {
    register,
    control,
    handleSubmit,

    formState: { errors },
  } = useForm<IApplicationForm>({
    defaultValues: {
      name: "",
      description: "",
      state: ApplicationState.Draft,
      questions: [{ title: "", responseType: ResponseType.TextField }],
    },
    mode: "onSubmit",
  })

  const [formData, setFormData] = useState<IApplicationForm>()

  const { fields, append, remove } = useFieldArray({
    name: "questions",
    control,
  })

  const onSubmit = (data: IApplicationForm) => {
    setFormData(data)
  }

  const preventEnterKeySubmit = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault()
    }
  }

  return (
    <>
      <form
        onSubmit={(event) => void handleSubmit(onSubmit)(event)}
        className={styles["application-form"]}
      >
        <section>
          <h2>Hakemuksen perustiedot</h2>
          <label htmlFor="name">Hakemuksen nimi</label>
          <input
            onKeyDown={preventEnterKeySubmit}
            aria-label="Kirjoita hakemuksen nimi"
            {...register("name", { required: true })}
            placeholder="Kirjoita hakemuksen nimi"
          />
          {errors.name && <p className={styles["error-message"]}>Pakollinen kenttä</p>}
          <label htmlFor="description">Hakemuksen kuvaus</label>
          <textarea
            onKeyDown={preventEnterKeySubmit}
            aria-label="Kirjoita hakemuksen kuvaus"
            {...register("description", { required: true })}
            placeholder="Kirjoita hakemuksen kuvaus"
          />
          {errors.description && <p className={styles["error-message"]}>Pakollinen kenttä</p>}
        </section>
        <section>
          <h2>Hakemuksen kysymykset</h2>
          {fields.map((_question, i) => (
            <div key={`question_${i}`} className={styles["question-area"]}>
              <div className={styles["question-input-area"]}>
                <input
                  onKeyDown={preventEnterKeySubmit}
                  aria-label="Kirjoita kysymys"
                  placeholder="Kysymyksen otsikko"
                  {...register(`questions.${i}.title`, { required: true })}
                />
                <select
                  onKeyDown={preventEnterKeySubmit}
                  {...register(`questions.${i}.responseType`, { required: true })}
                >
                  <option value={ResponseType.TextField}>Tekstikenttä</option>
                </select>
                <Button variant="secondary" onClick={() => remove(i)}>
                  Poista
                </Button>
              </div>

              {errors.questions && errors.questions[i]?.title?.type === "required" && (
                <p className={styles["error-message"]}>Pakollinen kenttä</p>
              )}
            </div>
          ))}
        </section>
        <div className={styles["button-container"]}>
          <Button
            variant="primary"
            type="button"
            onClick={() => append({ title: "", responseType: ResponseType.TextField })}
          >
            + Lisää kysymyksiä
          </Button>
          <Button variant="primary" type="submit">
            Tallenna hakemus
          </Button>
        </div>
      </form>
      {formData && <ApplicationFormTable formData={formData} />}
    </>
  )
}
