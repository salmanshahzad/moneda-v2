import Router from "@koa/router";
import argon2 from "argon2";

import logger from "../../config/logger";
import User from "../models/user";
import formatErrors from "../utils/formatErrors";
import Joi from "../utils/Joi";

const router = new Router({ prefix: "/user" });

router.get("/", async (ctx) => {
  const userId = ctx.session!["userId"];
  if (typeof userId !== "number") {
    ctx.status = 401;
    return;
  }

  const user = await User.findOneBy({ id: userId });
  if (user) {
    ctx.body = { user };
  } else {
    ctx.status = 401;
  }
});

router.post("/", async (ctx) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    confirmPassword: Joi.ref("password"),
  });
  const { error, value } = schema.validate(ctx.request.body);
  if (error) {
    ctx.status = 422;
    ctx.body = { errors: formatErrors(error) };
    return;
  }

  const { username, password } = value;
  const usersWithUsername = await User.countBy({ username });
  if (usersWithUsername > 0) {
    ctx.status = 422;
    ctx.body = {
      errors: [
        {
          key: "username",
          message: "username already exists",
        },
      ],
    };
    return;
  }

  const user = await User.create({
    username,
    password: await argon2.hash(password),
  }).save();
  logger.info(`Created user: ${username}`);
  ctx.status = 201;
  ctx.body = { user };
  ctx.session!["userId"] = user.id;
});

export default router;
