import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Avatar } from "./Avatar";

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
    eager: true,
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
