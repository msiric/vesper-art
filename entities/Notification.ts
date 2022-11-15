import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";

export enum NotificationType {
  order = "order",
  review = "review",
  comment = "comment",
}

@Entity()
export class Notification extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  @Generated("increment")
  serial: number;

  @ManyToOne(() => User, (user) => user.notifications)
  receiver: User;

  @Column()
  receiverId: string;

  @Column()
  link: string;

  @Column()
  ref: string;

  @Column({
    type: "enum",
    enum: NotificationType,
  })
  type: NotificationType;

  @Column()
  read: boolean;

  @CreateDateColumn({ type: "timestamptz" })
  created: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updated: Date;
}
