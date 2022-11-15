import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Version } from "./Version";

@Entity()
export class Intent extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  @Generated("increment")
  serial: number;

  @ManyToOne(() => User, (user) => user.intents)
  owner: User;

  @Column()
  ownerId: string;

  @ManyToOne(() => Version, (version) => version.intents, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  version: Version;

  @Column()
  versionId: string;

  @CreateDateColumn({ type: "timestamptz" })
  created: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updated: Date;
}
