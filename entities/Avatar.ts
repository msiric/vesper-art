import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Avatar extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => User)
  @JoinColumn()
  parent: User;

  @Column()
  source: string;

  @Column()
  orientation: string;

  @Column()
  dominant: string;

  @Column()
  height: string;

  @Column()
  width: string;

  @CreateDateColumn()
  created: Date;
}
