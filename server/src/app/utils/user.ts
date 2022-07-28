import argon2 from "argon2";
import type { FindOptionsWhere } from "typeorm";

import db from "../../config/db";
import Category from "../models/category";
import Transaction from "../models/transaction";
import User from "../models/user";

export async function createUser(username: string, password: string) {
  return await db.transaction(async (entityManager) => {
    const userInsertResult = await entityManager.insert(User, {
      username,
      password: await argon2.hash(password),
    });
    const userId: number = userInsertResult.raw[0].id;

    const income = ["Primary Income"].map((name) => ({
      name,
      type: "income" as const,
      colour: getRandomColour(),
      target: 0,
      amountForMonth: 0,
      userId,
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
      amountForMonth: 0,
      userId,
    }));
    const categories = [...income, ...expenses];
    await entityManager.insert(Category, categories);

    return {
      id: userId,
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
    categories,
    recentTransactions,
  };
}
