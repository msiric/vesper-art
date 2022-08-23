import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
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

  @Column({ default: "" })
  verificationToken: string;

  @CreateDateColumn({ type: "timestamptz", nullable: true, default: null })
  verificationExpiry: Date;

  @Column({ default: false })
  verified: boolean;

  @Column({ default: true })
  active: boolean;

  @Column({ default: false })
  generated: boolean;

  @CreateDateColumn({ type: "timestamptz", nullable: true })
  created: Date;

  @UpdateDateColumn({ type: "timestamptz", nullable: true })
  updated: Date;
}
