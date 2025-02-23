import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import "survey-core/defaultV2.min.css";

const json = {
    "logoPosition": "right",
        "pages": [
        {
            "name": "page1",
            "elements": [
                {
                    "type": "text",
                    "name": "question1",
                    "title": "Name"
                },
                {
                    "type": "text",
                    "name": "question2",
                    "title": "Järjestön nimi"
                }
            ]
        }
    ]
};

export const Registration = () => {
    const survey = new Model(json);
    return <div>
        <h1>Registration</h1>
        <Survey model={survey} />
    </div>
}