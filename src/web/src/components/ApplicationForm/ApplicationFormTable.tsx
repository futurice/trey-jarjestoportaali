import React from "react"
import { IApplicationForm } from "../../applicationForm/types"
import styles from "./ApplicationForm.module.css"

interface IApplicationFormTable {
  formData: IApplicationForm
}
export const ApplicationFormTable: React.FC<IApplicationFormTable> = ({ formData }) => {
  return (
    <table className={styles["form-table"]}>
      <tbody>
        <tr>
          <th>Hakemuksen nimi</th>
          <th>Hakemuksen kuvaus</th>
        </tr>
        <tr>
          <td>{formData?.name}</td>
          <td>{formData?.description}</td>
        </tr>
        <tr>
          <th>Kysymys</th>
          <th>Vastaustyyppi</th>
        </tr>
        {formData?.questions.map((question, i) => (
          <tr key={`question_${i}`}>
            <td>{question.title}</td>
            <td>{question.responseType}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
