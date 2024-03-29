import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Artwork } from "./Artwork";
import { Like } from "./Like";
import { User } from "./User";

@Entity()
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  @Generated("increment")
  serial: number;

  @ManyToOne(() => User, (user) => user.comments)
  owner: User;

  @Column()
  ownerId: string;

  @ManyToOne(() => Artwork, (artwork) => artwork.comments)
  artwork: Artwork;

  @Column()
  artworkId: string;

  @Column()
  content: string;

  @Column()
  modified: boolean;

  @Column({ default: false })
  generated: boolean;

  @OneToMany(() => Like, (like) => like.comment)
  likes: Like[];

  @CreateDateColumn({ type: "timestamptz" })
  created: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updated: Date;
}
