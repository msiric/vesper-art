import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
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

  @OneToOne(() => Order, (order) => order.review)
  order: Order;

  @OneToOne(() => Artwork)
  @JoinColumn()
  artwork: Artwork;

  @ManyToOne(() => User, (user) => user.givenReviews)
  reviewer: User;

  @ManyToOne(() => User, (user) => user.receivedReviews)
  reviewee: User;

  @Column()
  rating: number;

  @CreateDateColumn()
  created: Date;
}
