import { ValidationError } from "joi";

import logger from "../../config/logger";
import capitalize from "../utils/capitalize";

export interface Error {
  key: string;
  message: string;
}

function formatErrors({ details }: ValidationError): Error[] {
  return details.map((detail) => {
    const key = detail.context?.key ?? "";
    let message = "";

    switch (detail.type) {
      case "any.only":
        break;
      case "any.required":
      case "string.empty":
        message = `${key} is required`;
        break;
      case "string.base":
        message = `${key} must be a string`;
        break;
      case "number.integer":
        message = `${key} must be an integer`;
        break;
      case "number.min":
        message = `${key} must be at least ${detail.context?.["limit"]}`;
        break;
      case "date.base":
        message = `${key} must be a valid date (YYYY-MM-DD)`;
        break;
      default:
        logger.warn(`Unhandled error type: ${detail.type}`);
    }

    if (key === "confirmPassword" && detail.type === "any.only") {
      message = "Passwords do not match";
    }

    return { key, message: capitalize(message) };
  });
}

export default formatErrors;
