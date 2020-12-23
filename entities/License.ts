import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Artwork } from "./Artwork";
import { User } from "./User";

@Entity()
export class License extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => User)
  @JoinColumn()
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

  // Does it need an updated field?
}
