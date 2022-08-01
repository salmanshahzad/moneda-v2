import {
  BaseEntity,
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import Transaction from "./transaction";
import User from "./user";
import { moneyTransformer } from "../utils/transformers";

const categoryTypes = ["income", "expense"] as const;
export type CategoryType = typeof categoryTypes[number];

@Entity()
class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ enum: categoryTypes })
  type!: CategoryType;

  @Column()
  colour!: string;

  @Column({ type: "money", transformer: moneyTransformer })
  target!: number;

  @Column()
  @Index()
  userId!: number;

  @ManyToOne(() => User, (user) => user.categories, {
    nullable: false,
    onDelete: "CASCADE",
  })
  user!: User;

  @OneToMany(() => Transaction, (transaction) => transaction.category)
  transactions!: Transaction[];
}

export default Category;
