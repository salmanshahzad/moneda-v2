import Router from "@koa/router";
import formatErrors from "../utils/formatErrors";

import { getUser } from "../utils/user";
import Joi from "../utils/Joi";

const router = new Router({ prefix: "/session" });

router.post("/", async (ctx) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });
  const { error, value } = schema.validate(ctx.request.body);
  if (error) {
    ctx.status = 422;
    ctx.body = { errors: formatErrors(error) };
    return;
  }

  const errorResponse = {
    errors: [
      {
        key: "username",
        message: "username and/or password are incorrect",
      },
      {
        key: "password",
        message: "username and/or password are incorrect",
      },
    ],
  };

  const { username, password } = value;
  const user = await getUser({ username }, password);
  if (user === null) {
    ctx.status = 401;
    ctx.body = errorResponse;
    return;
  }

  ctx.body = { user };
  ctx.session!["userId"] = user.id;
});

router.delete("/", (ctx) => {
  ctx.status = 204;
  ctx.session = null;
});

export default router;
