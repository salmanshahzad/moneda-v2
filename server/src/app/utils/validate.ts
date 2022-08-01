import Joi from "joi";
import { Middleware } from "koa";

import formatErrors from "./formatErrors";

function validate(schema: Joi.ObjectSchema): Middleware {
  return async (ctx, next) => {
    const { error, value } = schema.validate(ctx.request.body);
    if (error) {
      ctx.status = 422;
      ctx.body = { errors: formatErrors(error) };
    } else {
      ctx.request.body = value;
      await next();
    }
  };
}

export default validate;
