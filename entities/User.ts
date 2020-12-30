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
import { Avatar } from "./Avatar";
import { Favorite } from "./Favorite";
import { Intent } from "./Intent";
import { Notification } from "./Notification";

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

  // $TODO should these three be removed completely and joined with query builder?

  // $TODO not pushed to user
  @OneToMany(() => Notification, (notification) => notification.receiver)
  notifications: Notification[];

  @OneToMany(() => Favorite, (favorite) => favorite.owner)
  favorites: Favorite[];

  // $TODO not pushed to user
  @OneToMany(() => Intent, (intent) => intent.owner)
  intents: Intent[];

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
