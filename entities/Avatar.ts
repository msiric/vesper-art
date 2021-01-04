import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Avatar extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => User)
  user: User;

  @Column()
  userId: string;

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
