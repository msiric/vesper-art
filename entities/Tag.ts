import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Version } from "./Version";

@Entity()
export class Tag extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToMany(() => Version, (version) => version.tags, {
    onDelete: "CASCADE",
  })
  versions: Version[];

  @Column()
  title: string;

  @CreateDateColumn()
  created: Date;
}
