import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Comment } from "./Comment";
import { Favorite } from "./Favorite";
import { User } from "./User";
import { Version } from "./Version";

@Entity()
export class Artwork extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.artworks)
  owner: User;

  @OneToOne(() => Version, (version) => version.artwork, {
    cascade: ["insert"],
  })
  @JoinColumn()
  current: Version;

  @OneToMany(() => Version, (version) => version.artwork)
  versions: Version[];

  @OneToMany(() => Comment, (comment) => comment.artwork)
  comments: Comment[];

  @OneToMany(() => Favorite, (favorite) => favorite.artwork)
  favorites: Favorite[];

  @Column()
  active: boolean;

  @Column()
  generated: boolean;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
