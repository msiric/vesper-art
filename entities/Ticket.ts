import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";

// $TODO ticket status === 'pending' | 'resolved'
export enum TicketType {
  pending = "pending",
  resolved = "resolved",
  closed = "closed",
}

@Entity()
export class Ticket extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User)
  owner: User;

  @Column()
  ownerId: string;

  @Column()
  title: string;

  @Column()
  body: string;

  @Column()
  attachment: string;

  @Column({
    type: "enum",
    enum: TicketType,
  })
  status: TicketType;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
