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
