import {
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
import { Artwork } from "./Artwork";
import { Discount } from "./Discount";
import { Intent } from "./Intent";
import { License } from "./License";
import { Review } from "./Review";
import { User } from "./User";
import { Version } from "./Version";

@Entity()
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.purchases)
  buyer: User;

  @ManyToOne(() => User, (user) => user.sales)
  seller: User;

  @OneToOne(() => Artwork)
  @JoinColumn()
  artwork: Artwork;

  @OneToOne(() => Version)
  @JoinColumn()
  version: Version;

  @OneToOne(() => License)
  @JoinColumn()
  license: License;

  @OneToOne(() => Discount)
  @JoinColumn()
  discount: Discount;

  @OneToOne(() => Review)
  @JoinColumn()
  review: Review;

  @OneToOne(() => Intent)
  @JoinColumn()
  intent: Intent;

  @Column()
  spent: number;

  @Column()
  earned: number;

  @Column()
  fee: number;

  @Column()
  commercial: boolean;

  @Column()
  status: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
