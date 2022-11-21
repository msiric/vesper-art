import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
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
import { Like } from "./Like";
import { Notification } from "./Notification";
import { Order } from "./Order";
import { Review } from "./Review";
import { View } from "./View";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  @Generated("increment")
  serial: number;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ unique: true, nullable: true })
  name: string;

  @Column()
  fullName: string;

  @Column()
  password: string;

  @OneToOne(() => Avatar, (avatar) => avatar.owner, {
    eager: true,
  })
  @JoinColumn()
  avatar: Avatar;

  @Column({ nullable: true })
  avatarId: string;

  @Column({ default: "" })
  description: string;

  @Column({ default: "" })
  country: string;

  @Column({ default: false })
  customWork: boolean;

  @Column({ default: true })
  displayFavorites: boolean;

  @Column({ default: "" })
  resetToken: string;

  @CreateDateColumn({ type: "timestamptz", nullable: true, default: null })
  resetExpiry: Date;

  @Column({ default: 0 })
  jwtVersion: number;

  @Column({ default: "" })
  stripeId: string;

  @Column({ default: false })
  onboarded: boolean;

  @Column({ default: "" })
  verificationToken: string;

  @CreateDateColumn({ type: "timestamptz", nullable: true, default: null })
  verificationExpiry: Date;

  @Column({ default: false })
  verified: boolean;

  @Column({ default: true })
  active: boolean;

  @OneToMany(() => Artwork, (artwork) => artwork.owner)
  artwork: Artwork[];

  @OneToMany(() => Comment, (comment) => comment.owner)
  comments: Comment[];

  @OneToMany(() => Favorite, (favorite) => favorite.owner)
  favorites: Favorite[];

  @OneToMany(() => Intent, (intent) => intent.owner)
  intents: Intent[];

  @OneToMany(() => License, (license) => license.owner)
  buyerLicenses: License[];

  @OneToMany(() => License, (license) => license.seller)
  sellerLicenses: License[];

  @OneToMany(() => Like, (like) => like.owner)
  likes: Like[];

  @OneToMany(() => Notification, (notification) => notification.receiver)
  notifications: Notification[];

  @OneToMany(() => Order, (order) => order.buyer)
  purchases: Order[];

  @OneToMany(() => Order, (order) => order.seller)
  sales: Order[];

  @OneToMany(() => Review, (review) => review.reviewer)
  reviewsGiven: Review[];

  @OneToMany(() => Review, (review) => review.reviewee)
  reviewsReceived: Review[];

  @OneToMany(() => View, (view) => view.owner)
  views: View[];

  @Column({ default: false })
  generated: boolean;

  @CreateDateColumn({ type: "timestamptz", nullable: true })
  created: Date;

  @UpdateDateColumn({ type: "timestamptz", nullable: true })
  updated: Date;
}
