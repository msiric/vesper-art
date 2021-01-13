import {
  AfterLoad,
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";
import { formatAmount } from "../common/helpers";

@Entity()
export class Discount extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

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
