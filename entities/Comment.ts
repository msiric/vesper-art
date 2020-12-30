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

  @ManyToOne(() => User, (user) => user, {
    onDelete: "CASCADE",
  })
  owner: User;

  @ManyToOne(() => Artwork, (artwork) => artwork.comments, {
    onDelete: "CASCADE",
  })
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
