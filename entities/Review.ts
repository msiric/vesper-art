import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
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

  @OneToOne(() => Order)
  @JoinColumn()
  order: Order;

  @OneToOne(() => Artwork)
  @JoinColumn()
  artwork: Artwork;

  @OneToOne(() => User)
  @JoinColumn()
  owner: User;

  @Column()
  rating: number;

  @CreateDateColumn()
  created: Date;
}
