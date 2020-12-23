import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Tag } from "./Tag";
import { Version } from "./Version";

@Entity()
export class VersionTags extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => Version)
  @JoinColumn()
  version: Version;

  @OneToOne(() => Tag)
  @JoinColumn()
  tag: Tag;

  @CreateDateColumn()
  created: Date;
}
