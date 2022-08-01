import Router from "@koa/router";
import dayjs from "dayjs";

import Category from "../models/category";
import Transaction from "../models/transaction";
import validate from "../utils/validate";
import Joi from "../utils/Joi";
import { userAuth } from "../utils/user";

const router = new Router({ prefix: "/transaction" });

const createSchema = Joi.object({
  amount: Joi.number().min(0.01).required(),
  categoryId: Joi.number().integer().min(1).required(),
  date: Joi.string()
    .custom((value, helpers) => {
      const date = dayjs(value, "YYYY-MM-DD");
      if (date.isValid()) return date;
      return helpers.error("date.base");
    })
    .required(),
  label: Joi.string().allow("").default(""),
  note: Joi.string().allow("").default(""),
});

router.post("/", userAuth, validate(createSchema), async (ctx) => {
  const { body: value } = ctx.request;

  const category = await Category.findOneBy({
    id: value.categoryId,
    userId: ctx["user"].id,
  });
  if (category === null) {
    ctx.status = 422;
    ctx.body = {
      errors: [{ key: "categoryId", value: "Category does not exist" }],
    };
    return;
  }

  const transaction = await Transaction.save({
    amount: value.amount,
    date: value.date,
    label: value.label,
    note: value.note,
    categoryId: value.categoryId,
    userId: ctx["user"].id,
  });

  ctx.status = 201;
  ctx.body = { transaction };
});

export default router;
