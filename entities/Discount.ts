import {
  AfterLoad,
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { formatAmount } from "../common/helpers";
import { Order } from "./Order";

@Entity()
export class Discount extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  @Generated("increment")
  serial: number;

  @Column()
  name: string;

  @Column()
  discount: number;

  @Column()
  active: boolean;

  @OneToMany(() => Order, (order) => order.discount)
  orders: Order[];

  @CreateDateColumn({ type: "timestamptz" })
  created: Date;

  @AfterLoad()
  correctAmount() {
    this.discount = formatAmount(this.discount).value;
  }
}
