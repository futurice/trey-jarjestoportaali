import React, { BaseSyntheticEvent, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { ApplicationState, IApplicationForm, ResponseType } from "../../applicationForm/types"
import { Button } from "../Button/Button"
import styles from "./ApplicationForm.module.css"
import { ApplicationFormTable } from "./ApplicationFormTable"

export const ApplicationForm: React.FC = () => {
  const { t } = useTranslation()
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

  const onSubmit = (
    data: IApplicationForm,
    e: BaseSyntheticEvent<object, any, any> | undefined,
  ) => {
    if (e) {
      setFormData(data)
    }
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
          <h2>{t("form.info")}</h2>
          <label htmlFor="name">{t("form.name.label")}</label>
          <input
            onKeyDown={preventEnterKeySubmit}
            aria-label={t("form.name.placeholder")}
            {...register("name", { required: true })}
            placeholder={t("form.name.placeholder")}
          />
          {errors.name && <p className={styles["error-message"]}>{t("form.required")}</p>}
          <label htmlFor="description">{t("form.description.label")}</label>
          <textarea
            onKeyDown={preventEnterKeySubmit}
            aria-label={t("form.description.placeholder")}
            {...register("description", { required: true })}
            placeholder={t("form.description.placeholder")}
          />
          {errors.description && <p className={styles["error-message"]}>{t("form.required")}</p>}
        </section>
        <section>
          <h2>{t("form.questions")}</h2>
          {fields.map((question, i) => (
            <div key={question.id} className={styles["question-area"]}>
              <div className={styles["question-input-area"]}>
                <input
                  onKeyDown={preventEnterKeySubmit}
                  aria-label={t("form.question.placeholder")}
                  placeholder={t("form.question.placeholder")}
                  {...register(`questions.${i}.title`, { required: true })}
                />
                <select
                  onKeyDown={preventEnterKeySubmit}
                  {...register(`questions.${i}.responseType`, { required: true })}
                >
                  <option value={ResponseType.TextField}>{t("form.question.textField")}</option>
                </select>
                <Button disabled={i === 0} variant="secondary" onClick={() => remove(i)}>
                  {t("delete")}
                </Button>
              </div>

              {errors.questions && errors.questions[i]?.title?.type === "required" && (
                <p className={styles["error-message"]}>{t("form.required")}</p>
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
            + {t("form.question.add")}
          </Button>
          <Button variant="primary" type="submit">
            {t("form.submit")}
          </Button>
        </div>
      </form>
      {formData && <ApplicationFormTable formData={formData} />}
    </>
  )
}
