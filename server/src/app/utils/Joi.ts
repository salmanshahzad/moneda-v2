import Joi from "joi";

const customJoi = Joi.defaults((schema) => {
  return schema.options({ abortEarly: false });
});

export default customJoi;
