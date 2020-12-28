import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Artwork } from "./Artwork";
import { Avatar } from "./Avatar";
import { Comment } from "./Comment";
import { Favorite } from "./Favorite";
import { Intent } from "./Intent";
import { License } from "./License";
import { Notification } from "./Notification";
import { Order } from "./Order";
import { Review } from "./Review";
import { Ticket } from "./Ticket";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  name: string;

  @Column()
  password: string;

  @OneToOne(() => Avatar, (avatar) => avatar.user, {
    cascade: ["insert", "update"],
  })
  @JoinColumn()
  avatar: Avatar;

  @Column({ default: "" })
  description: string;

  @Column({ default: "" })
  country: string;

  @Column({ default: "" })
  businessAddress: string;

  @Column({ default: false })
  customWork: boolean;

  @Column({ default: true })
  displayFavorites: boolean;

  @OneToMany(() => Review, (review) => review.reviewee)
  receivedReviews: Review[];

  @OneToMany(() => Review, (review) => review.reviewer)
  givenReviews: Review[];
  // $TODO not pushed to user
  @OneToMany(() => Notification, (notification) => notification.receiver)
  notifications: Notification[];

  @OneToMany(() => Artwork, (artwork) => artwork.owner, { cascade: ["insert"] })
  artwork: Artwork[];

  @OneToMany(() => Favorite, (favorite) => favorite.owner)
  favorites: Favorite[];
  // $TODO not pushed to user
  @OneToMany(() => Order, (order) => order.buyer)
  purchases: Order[];
  // $TODO not pushed to user
  @OneToMany(() => Order, (order) => order.seller)
  sales: Order[];
  // $TODO not pushed to user
  @OneToMany(() => Intent, (intent) => intent.owner)
  intents: Intent[];

  @OneToMany(() => Ticket, (ticket) => ticket.owner)
  tickets: Ticket[];
  // $TODO not pushed to user
  @OneToMany(() => License, (license) => license.owner)
  licenses: License[];

  @OneToMany(() => Comment, (comment) => comment.owner)
  comments: Comment[];

  @Column({ default: "" })
  resetToken: string;

  @CreateDateColumn()
  resetExpiry: Date;

  @Column({ default: 0 })
  jwtVersion: number;

  @Column({ default: "" })
  stripeId: string;

  @Column({ default: "" })
  verificationToken: string;

  @Column({ default: false })
  verified: boolean;

  @Column({ default: true })
  active: boolean;

  @Column({ default: false })
  generated: boolean;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
