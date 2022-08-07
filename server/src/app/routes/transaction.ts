import Router from "@koa/router";
import dayjs from "dayjs";

import Category from "../models/category";
import Transaction from "../models/transaction";
import Joi from "../utils/Joi";
import { userAuth } from "../utils/user";
import validate, { validateId } from "../utils/validate";

const router = new Router({ prefix: "/transaction" });

// const getSchema = Joi.object({
//   limit: Joi.number().integer().min(1).max(50).required(),
//   offset: Joi.number().integer().min(0).required(),
// });

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

router.get("/", userAuth, async (ctx) => {
  const { limit, offset } = ctx.request.query;

  const transactions = await Transaction.find({
    where: { userId: ctx.session!["userId"] },
    take: parseInt(limit as string),
    skip: parseInt(offset as string),
    order: {
      date: "DESC",
      id: "DESC",
    },
    relations: { category: true },
  });

  ctx.body = { transactions };
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

router.put(
  "/:id",
  userAuth,
  validateId,
  validate(createSchema),
  async (ctx) => {
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

    const { affected } = await Transaction.update(
      { id: ctx["id"] },
      {
        amount: value.amount,
        date: value.date,
        label: value.label,
        note: value.note,
        categoryId: value.categoryId,
      }
    );

    if (affected === 0) {
      ctx.status = 404;
      ctx.body = { errors: [{ key: "id", value: "Id does not exist" }] };
      return;
    }

    ctx.status = 204;
  }
);

router.delete("/:id", userAuth, validateId, async (ctx) => {
  const { affected } = await Transaction.delete({ id: ctx["id"] });

  if (affected === 0) {
    ctx.status = 404;
    ctx.body = { errors: [{ key: "id", value: "Id does not exist" }] };
    return;
  }

  ctx.status = 204;
});

export default router;
