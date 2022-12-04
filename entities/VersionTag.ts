import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Version } from "./Version";

@Entity()
export class VersionTag extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  @Generated("increment")
  serial: number;

  @PrimaryColumn()
  versionId: string;

  @PrimaryColumn()
  tagId: string;

  @ManyToOne(() => Version, (version) => version.tagConnection, {
    primary: true,
  })
  @JoinColumn({ name: "versionId" })
  version: Promise<Version>;

  @CreateDateColumn({ type: "timestamptz" })
  created: Date;
}
