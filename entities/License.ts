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
import { Artwork } from "./Artwork";
import { User } from "./User";

@Entity()
export class License extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.licenses)
  owner: User;

  @OneToOne(() => Artwork)
  @JoinColumn()
  artwork: Artwork;

  @Column()
  fingerprint: string;

  @Column()
  assignee: string;

  @Column()
  company: string;

  @Column()
  text: string;

  @Column()
  active: boolean;

  @Column()
  price: number;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
