import argon2 from "argon2";
import Joi from "joi";
import { Middleware } from "koa";

import formatErrors from "./formatErrors";

export function validatePassword(key: string): Middleware {
  return async (ctx, next) => {
    const password = ctx.request.body[key];
    const isCorrect = await argon2.verify(ctx["user"].password, password);
    if (isCorrect) {
      await next();
    } else {
      ctx.status = 401;
      ctx.body = { errors: [{ key, message: "Password is incorrect" }] };
    }
  };
}

export const validateId: Middleware = async (ctx, next) => {
  const id = parseInt(ctx["params"]["id"]!);
  if (isNaN(id) || id <= 0) {
    ctx.status = 422;
    ctx.body = { errors: [{ key: "id", value: "Id is invalid" }] };
  } else {
    ctx["id"] = id;
    await next();
  }
};

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
