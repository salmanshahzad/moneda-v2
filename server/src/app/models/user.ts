import {
  BaseEntity,
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import Category from "./category";
import Transaction from "./transaction";

@Entity()
class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @Index({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @Column({ default: false })
  isTwoFactorEnabled!: boolean;

  @Column({ nullable: true, type: "varchar" })
  twoFactorSecret?: string | null;

  @OneToMany(() => Category, (category) => category.user)
  categories!: Category[];

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions!: Transaction[];
}

export default User;
