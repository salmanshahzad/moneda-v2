import Router from "@koa/router";

import logger from "../../config/logger";
import User from "../models/user";
import Joi from "../utils/Joi";
import validate from "../utils/validate";
import { createUser, getUser, userAuth } from "../utils/user";

const router = new Router({ prefix: "/user" });

const createSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
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

export default router;
