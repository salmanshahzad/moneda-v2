import Router from "@koa/router";

import Joi from "../utils/Joi";
import validate from "../utils/validate";
import { getUser } from "../utils/user";

const router = new Router({ prefix: "/session" });

const signInSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

router.post("/", validate(signInSchema), async (ctx) => {
  const errorResponse = {
    errors: [
      {
        key: "username",
        message: "Username and/or password are incorrect",
      },
      {
        key: "password",
        message: "Username and/or password are incorrect",
      },
    ],
  };

  const { username, password } = ctx.request.body;
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
