import {
  BaseEntity,
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import Category from "./category";
import User from "./user";
import { dateTransformer, moneyTransformer } from "../utils/transformers";

@Entity()
class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "date", transformer: dateTransformer })
  @Index()
  date!: Date;

  @Column({
    type: "money",
    transformer: moneyTransformer,
  })
  amount!: number;

  @Column()
  title!: string;

  @Column({ default: "" })
  note!: string;

  @Column()
  @Index()
  userId!: number;

  @ManyToOne(() => User, (user) => user.categories, {
    nullable: false,
    onDelete: "CASCADE",
  })
  user!: User;

  @Column()
  @Index()
  categoryId!: number;

  @ManyToOne(() => Category, (category) => category.transactions, {
    nullable: false,
    onDelete: "CASCADE",
  })
  category!: Category;
}

export default Transaction;
