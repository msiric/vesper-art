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

  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @OneToOne(() => Avatar)
  @JoinColumn()
  avatar: Avatar;

  @Column()
  description: string;

  @Column()
  country: string;

  @Column()
  businessAddress: string;

  @Column()
  customWork: boolean;

  @Column()
  displayFavorites: boolean;

  @OneToMany(() => Review, (review) => review.reviewee)
  receivedReviews: Review[];

  @OneToMany(() => Review, (review) => review.reviewer)
  givenReviews: Review[];

  @OneToMany(() => Notification, (notification) => notification.receiver)
  notifications: Notification[];

  @OneToMany(() => Artwork, (artwork) => artwork.owner)
  artworks: Artwork[];

  @OneToMany(() => Favorite, (favorite) => favorite.owner)
  favorites: Favorite[];

  @OneToMany(() => Order, (order) => order.buyer)
  purchases: Order[];

  @OneToMany(() => Order, (order) => order.seller)
  sales: Order[];

  @OneToMany(() => Intent, (intent) => intent.owner)
  intents: Intent[];

  @OneToMany(() => Ticket, (ticket) => ticket.owner)
  tickets: Ticket[];

  @OneToMany(() => License, (license) => license.owner)
  licenses: License[];

  @OneToMany(() => Comment, (comment) => comment.owner)
  comments: Comment[];

  @Column()
  resetToken: string;

  @CreateDateColumn()
  resetExpiry: Date;

  @Column()
  jwtVersion: number;

  @Column()
  stripeId: string;

  @Column()
  verificationToken: string;

  @Column()
  verified: boolean;

  @Column()
  active: boolean;

  @Column()
  generated: boolean;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
