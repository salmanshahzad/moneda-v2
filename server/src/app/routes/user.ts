import Router from "@koa/router";
import argon2 from "argon2";

import logger from "../../config/logger";
import User from "../models/user";
import Joi from "../utils/Joi";
import validate, { validatePassword } from "../utils/validate";
import { createUser, getUser, userAuth } from "../utils/user";

const router = new Router({ prefix: "/user" });

const createSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
});

const changeUsernameSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  password: Joi.string().required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
});

const deleteSchema = Joi.object({
  password: Joi.string().required(),
});

router.get("/", userAuth, async (ctx) => {
  const user = await getUser({ id: ctx["user"].id });
  ctx.body = { user };
});

router.post("/", validate(createSchema), async (ctx) => {
  const { username, password } = ctx.request.body;
  const usersWithUsername = await User.countBy({ username });
  if (usersWithUsername > 0) {
    ctx.status = 422;
    ctx.body = {
      errors: [
        {
          key: "username",
          message: "Username already exists",
        },
      ],
    };
    return;
  }

  const user = await createUser(username, password);
  logger.info(`Created user: ${username}`);
  ctx.status = 201;
  ctx.body = { user };
  ctx.session!["userId"] = user.id;
});

router.put(
  "/username",
  userAuth,
  validate(changeUsernameSchema),
  validatePassword("password"),
  async (ctx) => {
    const { username } = ctx.request.body;
    if (username !== ctx["user"].username) {
      const usersWithSameUsername = await User.countBy({ username });
      if (usersWithSameUsername > 0) {
        ctx.status = 422;
        ctx.body = {
          errors: [{ key: "username", message: "Username already exists" }],
        };
        return;
      }
      await User.update({ id: ctx["user"].id }, { username });
    }
    ctx.status = 204;
  }
);

router.put(
  "/password",
  userAuth,
  validate(changePasswordSchema),
  validatePassword("oldPassword"),
  async (ctx) => {
    await User.update(
      { id: ctx["user"].id },
      {
        password: await argon2.hash(ctx.request.body.password),
      }
    );
    ctx.status = 204;
  }
);

router.delete(
  "/",
  userAuth,
  validate(deleteSchema),
  validatePassword("password"),
  async (ctx) => {
    await User.delete({ id: ctx["user"].id });
    ctx.status = 204;
  }
);

export default router;
