import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Version } from "./Version";

@Entity()
export class Artwork extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User)
  owner: User;

  @OneToOne(() => Version, (version) => version.artwork, {
    cascade: ["insert"],
  })
  @JoinColumn()
  current: Version;

  @Column()
  active: boolean;

  @Column()
  generated: boolean;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
