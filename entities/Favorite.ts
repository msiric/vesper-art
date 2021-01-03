import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Artwork } from "./Artwork";
import { User } from "./User";

@Entity()
export class Favorite extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user)
  owner: User;

  @Column()
  ownerId: string;

  @ManyToOne(() => Artwork, (artwork) => artwork)
  artwork: Artwork;

  @Column()
  artworkId: string;

  @CreateDateColumn()
  created: Date;
}
