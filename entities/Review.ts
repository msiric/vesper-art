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

  @ManyToOne(() => Artwork)
  artwork: Artwork;

  @Column()
  artworkId: string;

  @ManyToOne(() => User)
  reviewer: User;

  @Column()
  reviewerId: string;

  @ManyToOne(() => User)
  reviewee: User;

  @Column()
  revieweeId: string;

  @Column()
  rating: number;

  @CreateDateColumn({ type: "timestamptz" })
  created: Date;
}
