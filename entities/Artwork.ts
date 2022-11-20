import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Comment } from "./Comment";
import { Favorite } from "./Favorite";
import { License } from "./License";
import { Order } from "./Order";
import { Review } from "./Review";
import { User } from "./User";
import { Version } from "./Version";

export enum ArtworkVisibility {
  visible = "visible",
  invisible = "invisible",
}

@Entity()
export class Artwork extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  @Generated("increment")
  serial: number;

  @ManyToOne(() => User, (user) => user.artwork)
  owner: User;

  @Column()
  ownerId: string;

  @OneToOne(() => Version)
  @JoinColumn()
  current: Version;

  @Column({ nullable: true })
  currentId: string;

  @Column()
  active: boolean;

  @Column({
    type: "enum",
    enum: ArtworkVisibility,
  })
  visibility: ArtworkVisibility;

  @OneToMany(() => Favorite, (favorite) => favorite.artwork)
  favorites: Favorite[];

  @OneToMany(() => Comment, (comment) => comment.artwork)
  comments: Comment[];

  @OneToMany(() => Review, (review) => review.artwork)
  reviews: Review[];

  @OneToMany(() => License, (license) => license.artwork)
  licenses: License[];

  @OneToMany(() => Order, (order) => order.artwork)
  orders: Order[];

  @Column({ default: false })
  generated: boolean;

  @CreateDateColumn({ type: "timestamptz" })
  created: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updated: Date;
}
