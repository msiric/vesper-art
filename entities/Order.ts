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
import { Discount } from "./Discount";
import { Intent } from "./Intent";
import { License } from "./License";
import { Review } from "./Review";
import { User } from "./User";
import { Version } from "./Version";

export enum OrderType {
  free = "free",
  commercial = "commercial",
}

export enum OrderStatus {
  completed = "completed",
  canceled = "canceled",
  // ovo je test za novi checkout (trenutno delayed)
  processing = "processing",
}

@Entity()
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User)
  buyer: User;

  @Column()
  buyerId: string;

  @ManyToOne(() => User)
  seller: User;

  @Column()
  sellerId: string;

  @ManyToOne(() => Artwork)
  @JoinColumn()
  artwork: Artwork;

  @Column()
  artworkId: string;

  @ManyToOne(() => Version)
  @JoinColumn()
  version: Version;

  @Column()
  versionId: string;

  @OneToOne(() => License)
  @JoinColumn()
  license: License;

  @Column()
  licenseId: string;

  @ManyToOne(() => Discount)
  @JoinColumn()
  discount: Discount;

  @Column({ nullable: true })
  discountId: string;

  @OneToOne(() => Review)
  @JoinColumn()
  review: Review;

  @Column({ nullable: true })
  reviewId: string;

  @OneToOne(() => Intent)
  @JoinColumn()
  intent: Intent;

  @Column()
  intentId: string;

  @Column()
  spent: number;

  @Column()
  earned: number;

  @Column()
  fee: number;

  @Column({
    type: "enum",
    enum: OrderType,
  })
  type: OrderType;

  @Column({
    type: "enum",
    enum: OrderStatus,
  })
  status: OrderStatus;

  @CreateDateColumn({ type: "timestamptz" })
  created: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updated: Date;

  @AfterLoad()
  correctAmount() {
    this.spent = formatAmount(this.spent).value;
    this.earned = formatAmount(this.earned).value;
    this.fee = formatAmount(this.fee).value;
  }
}
