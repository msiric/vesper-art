import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Artwork } from "./Artwork";
import { User } from "./User";

@Entity()
export class Favorite extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  @Generated("increment")
  serial: number;

  @ManyToOne(() => User, (user) => user)
  owner: User;

  @Column()
  ownerId: string;

  @ManyToOne(() => Artwork)
  artwork: Artwork;

  @Column()
  artworkId: string;

  @CreateDateColumn({ type: "timestamptz" })
  created: Date;
}
