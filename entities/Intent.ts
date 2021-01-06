import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Version } from "./Version";

// $TODO status === 'pending' | 'succeeded' | 'canceled'

@Entity()
export class Intent extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @ManyToOne(() => User)
  owner: User;

  @Column()
  ownerId: string;

  @OneToOne(() => Version)
  @JoinColumn()
  version: Version;

  @Column()
  versionId: string;

  @Column()
  status: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
