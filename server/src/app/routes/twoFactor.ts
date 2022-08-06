import Router from "@koa/router";
import * as twoFactor from "node-2fa";

import User from "../models/user";
import Joi from "../utils/Joi";
import validate from "../utils/validate";
import { userAuth } from "../utils/user";

const router = new Router({ prefix: "/two-factor" });

const verifySchema = Joi.object({
  token: Joi.string().required(),
});

router.post("/", userAuth, async (ctx) => {
  const { id, isTwoFactorEnabled, username } = ctx["user"];
  if (isTwoFactorEnabled) {
    ctx.status = 204;
    return;
  }

  const secret = twoFactor.generateSecret({
    name: "Moneda",
    account: username,
  });
  await User.update({ id }, { twoFactorSecret: secret.secret });
  ctx.body = secret;
});

router.post("/verify", userAuth, validate(verifySchema), async (ctx) => {
  const { isTwoFactorEnabled, twoFactorSecret } = ctx["user"];
  const result = twoFactor.verifyToken(twoFactorSecret, ctx.request.body.token);
  if (result?.delta === 0) {
    if (!isTwoFactorEnabled) {
      await User.update({ id: ctx["user"].id }, { isTwoFactorEnabled: true });
    }
    ctx.status = 204;
  } else {
    ctx.status = 422;
    ctx.body = { errors: [{ key: "token", message: "Token is invalid" }] };
  }
});

router.delete("/", userAuth, async (ctx) => {
  await User.update(
    { id: ctx["user"].id },
    { isTwoFactorEnabled: false, twoFactorSecret: null }
  );
  ctx.status = 204;
});

export default router;
