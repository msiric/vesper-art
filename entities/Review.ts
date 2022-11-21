import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Artwork } from "./Artwork";
import { Order } from "./Order";
import { User } from "./User";

@Entity()
export class Review extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  @Generated("increment")
  serial: number;

  @OneToOne(() => Order)
  order: Order;

  @Column()
  orderId: string;

  @ManyToOne(() => Artwork, (artwork) => artwork.reviews)
  artwork: Artwork;

  @Column()
  artworkId: string;

  @ManyToOne(() => User, (user) => user.reviewsGiven)
  reviewer: User;

  @Column()
  reviewerId: string;

  @ManyToOne(() => User, (user) => user.reviewsReceived)
  reviewee: User;

  @Column()
  revieweeId: string;

  @Column()
  rating: number;

  @Column({ default: false })
  generated: boolean;

  @CreateDateColumn({ type: "timestamptz" })
  created: Date;
}
