import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Artwork } from "./Artwork";
import { User } from "./User";

@Entity()
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.comments)
  owner: User;

  @ManyToOne(() => Artwork, (artwork) => artwork.comments)
  artwork: Artwork;

  @Column()
  content: string;

  @Column()
  modified: boolean;

  @Column()
  generated: boolean;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
