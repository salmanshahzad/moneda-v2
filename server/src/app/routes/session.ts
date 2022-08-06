import Router from "@koa/router";
import * as twoFactor from "node-2fa";

import Joi from "../utils/Joi";
import validate from "../utils/validate";
import { getUser } from "../utils/user";

const router = new Router({ prefix: "/session" });

const signInSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  token: Joi.string(),
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

  const { username, password, token } = ctx.request.body;
  const user = await getUser({ username }, password);
  if (user === null) {
    ctx.status = 401;
    ctx.body = errorResponse;
    return;
  }

  const { twoFactorSecret, ...rest } = user;
  if (user.isTwoFactorEnabled) {
    if (typeof token === "string") {
      const result = twoFactor.verifyToken(user.twoFactorSecret!, token);
      if (result?.delta === 0) {
        ctx.body = { user: rest };
        ctx.session!["userId"] = user.id;
      } else {
        ctx.status = 401;
        ctx.body = { errors: [{ key: "token", message: "Token is invalid" }] };
      }
    } else {
      ctx.body = { user: { isTwoFactorEnabled: true } };
    }
  } else {
    ctx.body = { user: rest };
    ctx.session!["userId"] = user.id;
  }
});

router.delete("/", (ctx) => {
  ctx.status = 204;
  ctx.session = null;
});

export default router;
