import {
  AfterLoad,
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { formatAmount } from "../common/helpers";
import { Artwork } from "./Artwork";
import { User } from "./User";

@Entity()
export class License extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.licenses, {
    onDelete: "CASCADE",
  })
  owner: User;

  @OneToOne(() => Artwork)
  @JoinColumn()
  artwork: Artwork;

  @Column()
  fingerprint: string;

  @Column()
  assignee: string;

  @Column()
  company: string;

  @Column()
  type: string;

  @Column()
  active: boolean;

  @Column()
  price: number;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @AfterLoad()
  correctAmount() {
    this.price = formatAmount(this.price).intValue;
  }
}
