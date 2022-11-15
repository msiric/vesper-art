import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Comment } from "./Comment";
import { User } from "./User";

@Entity()
export class Like extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  @Generated("increment")
  serial: number;

  @ManyToOne(() => User, (user) => user.likes)
  owner: User;

  @Column()
  ownerId: string;

  @ManyToOne(() => Comment, (comment) => comment.likes)
  comment: Comment;

  @Column()
  commentId: string;

  @CreateDateColumn({ type: "timestamptz" })
  created: Date;
}
