import { Middleware } from "@koa/router";
import argon2 from "argon2";
import type { FindOptionsWhere } from "typeorm";

import db from "../../config/db";
import logger from "../../config/logger";
import Category from "../models/category";
import Transaction from "../models/transaction";
import User from "../models/user";

export const userAuth: Middleware = async (ctx, next) => {
  const userId = ctx.session!["userId"];
  if (typeof userId === "number") {
    const user = await User.findOneBy({ id: userId });
    if (user) {
      ctx["user"] = user;
      await next();
    } else {
      logger.warn(`Session contains non-existant user id: ${userId}`);
      ctx.status = 401;
    }
  } else {
    ctx.status = 401;
  }
};

export async function createUser(username: string, password: string) {
  return await db.transaction(async (entityManager) => {
    const user = await entityManager.save(User, {
      username,
      password: await argon2.hash(password),
    });

    const income = ["Primary Income"].map((name) => ({
      name,
      type: "income" as const,
      colour: getRandomColour(),
      target: 0,
      userId: user.id,
    }));
    const expenses = [
      "Car maintenance",
      "Car payment",
      "Childcare",
      "Clothing",
      "Condo fees",
      "Debt",
      "Electronics",
      "Entertainment",
      "Gas",
      "Gifts",
      "Going out",
      "Groceries",
      "Gym",
      "Home maintenance",
      "Insurance",
      "Medical",
      "Mortgage",
      "Other",
      "Public transportation",
      "Rent",
      "Restaurant",
      "Telecom",
      "Travel",
      "Utilities",
      "Work",
    ].map((name) => ({
      name,
      type: "expense" as const,
      colour: getRandomColour(),
      target: 0,
      userId: user.id,
    }));
    const categories = await entityManager.save(Category, [
      ...income,
      ...expenses,
    ]);

    return {
      id: user.id,
      username,
      categories,
    };
  });
}

function getRandomColour(): string {
  const rand = () => Math.floor(Math.random() * 256);
  const hex = (num: number) => num.toString(16).toUpperCase().padStart(2, "0");
  const part = () => hex(rand());
  return `#${part()}${part()}${part()}`;
}

export async function getUser(
  where: FindOptionsWhere<User>,
  password?: string
) {
  const user = await User.findOneBy(where);
  if (user === null) {
    return null;
  }

  if (typeof password !== "undefined") {
    const verify = await argon2.verify(user.password, password);
    if (!verify) {
      return null;
    }
  }

  const categories = await Category.findBy({ userId: user.id });
  const recentTransactions = await Transaction.find({
    order: {
      date: "DESC",
      id: "DESC",
    },
    take: 5,
    where: { userId: user.id },
  });

  return {
    id: user.id,
    username: user.username,
    isTwoFactorEnabled: user.isTwoFactorEnabled,
    categories,
    recentTransactions,
  };
}
