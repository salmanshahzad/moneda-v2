import { ValidationError } from "joi";

import logger from "../../config/logger";

export interface Error {
  key: string;
  message: string;
}

function formatErrors({ details }: ValidationError): Error[] {
  return details.map((detail) => {
    const key = detail.context?.key ?? "";
    let message = "";

    switch (detail.type) {
      case "any.required":
      case "string.empty":
        message = `${key} is required`;
        break;
      case "string.base":
        message = `${key} must be a string`;
        break;
      default:
        logger.warn(`Unhandled error type: ${detail.type}`);
    }

    return { key, message };
  });
}

export default formatErrors;
