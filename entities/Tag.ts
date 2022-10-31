import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Version } from "./Version";

@Entity()
export class Tag extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  @Generated("increment")
  serial: number;

  @ManyToMany(() => Version, (version) => version.tags, {
    onDelete: "CASCADE",
  })
  versions: Version[];

  @Column()
  title: string;

  @CreateDateColumn({ type: "timestamptz" })
  created: Date;
}
