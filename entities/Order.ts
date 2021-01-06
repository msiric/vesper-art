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

  @OneToOne(() => Artwork)
  @JoinColumn()
  artwork: Artwork;

  @Column()
  artworkId: string;

  @OneToOne(() => Version)
  @JoinColumn()
  version: Version;

  @Column()
  versionId: string;

  @OneToOne(() => License)
  @JoinColumn()
  license: License;

  @Column()
  licenseId: string;

  @OneToOne(() => Discount)
  @JoinColumn()
  discount: Discount;

  @Column()
  discountId: string;

  @OneToOne(() => Review)
  @JoinColumn()
  review: Review;

  @Column()
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

  @Column()
  type: string;

  @Column()
  status: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @AfterLoad()
  correctAmount() {
    this.spent = formatAmount(this.spent).value;
    this.earned = formatAmount(this.earned).value;
    this.fee = formatAmount(this.fee).value;
  }
}
