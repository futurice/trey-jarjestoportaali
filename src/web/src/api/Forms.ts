import { IApplicationForm } from "../applicationForm/types";

const BACKEND_URL = import.meta.env.BACKEND_URL || "http://localhost:3100";

export const saveForm = async (form: IApplicationForm) => {
  const response = await fetch(`${BACKEND_URL}/forms`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  });

  if (!response.ok) {
    throw new Error("Failed to save form");
  }
};