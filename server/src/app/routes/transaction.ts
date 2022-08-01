import Router from "@koa/router";
import dayjs from "dayjs";

import Category from "../models/category";
import Transaction from "../models/transaction";
import formatErrors from "../utils/formatErrors";
import Joi from "../utils/Joi";

const router = new Router({ prefix: "/transaction" });

router.post("/", async (ctx) => {
  const userId = ctx.session!["userId"];
  if (typeof userId !== "number") {
    ctx.status = 401;
    return;
  }

  const schema = Joi.object({
    amount: Joi.number().min(0.01).required(),
    categoryId: Joi.number().integer().min(1).required(),
    date: Joi.string()
      .custom((value, helpers) => {
        const date = dayjs(value, "YYYY-MM-DD");
        if (date.isValid()) return date;
        return helpers.error("date.base");
      })
      .required(),
    label: Joi.string().default(""),
    note: Joi.string().default(""),
  });
  const { error, value } = schema.validate(ctx.request.body);
  if (error) {
    ctx.status = 422;
    ctx.body = { errors: formatErrors(error) };
    return;
  }

  const category = await Category.findOneBy({ id: value.categoryId, userId });
  if (category === null) {
    ctx.status = 422;
    ctx.body = {
      errors: [{ key: "categoryId", value: "Category does not exist" }],
    };
    return;
  }

  const transaction = await Transaction.create({
    amount: value.amount,
    date: value.date,
    label: value.label,
    note: value.note,
    categoryId: value.categoryId,
    userId,
  }).save();

  ctx.status = 201;
  ctx.body = { transaction };
});

export default router;
