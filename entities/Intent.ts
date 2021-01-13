import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Version } from "./Version";

export enum IntentStatus {
  pending = "pending",
  succeeded = "succeeded",
  canceled = "canceled",
}

@Entity()
export class Intent extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @ManyToOne(() => User)
  owner: User;

  @Column()
  ownerId: string;

  @ManyToOne(() => Version)
  @JoinColumn()
  version: Version;

  @Column()
  versionId: string;

  @Column({
    type: "enum",
    enum: IntentStatus,
  })
  status: IntentStatus;

  @CreateDateColumn({ type: "timestamptz" })
  created: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updated: Date;
}
