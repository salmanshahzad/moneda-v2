import Router from "@koa/router";

import logger from "../../config/logger";
import User from "../models/user";
import formatErrors from "../utils/formatErrors";
import { createUser, getUser } from "../utils/user";
import Joi from "../utils/Joi";

const router = new Router({ prefix: "/user" });

router.get("/", async (ctx) => {
  const userId = ctx.session!["userId"];
  if (typeof userId !== "number") {
    ctx.status = 401;
    return;
  }

  const user = await getUser({ id: userId });
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
    confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
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

  const user = await createUser(username, password);
  logger.info(`Created user: ${username}`);
  ctx.status = 201;
  ctx.body = { user };
  ctx.session!["userId"] = user.id;
});

export default router;
