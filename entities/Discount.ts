import {
  AfterLoad,
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
} from "typeorm";
import { formatAmount } from "../common/helpers";

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

  @CreateDateColumn({ type: "timestamptz" })
  created: Date;

  @AfterLoad()
  correctAmount() {
    this.discount = formatAmount(this.discount).value;
  }
}
