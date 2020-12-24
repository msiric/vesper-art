import {
  BaseEntity,
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

  @ManyToOne(() => User, (user) => user.favorites)
  owner: User;

  @ManyToOne(() => Artwork, (artwork) => artwork.favorites)
  artwork: Artwork;

  @CreateDateColumn()
  created: Date;
}
