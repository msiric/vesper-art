import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Artwork } from "./Artwork";
import { User } from "./User";

@Entity()
export class ArtworkFavorites extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => User)
  @JoinColumn()
  owner: User;

  @OneToOne(() => Artwork)
  @JoinColumn()
  artwork: Artwork;

  @CreateDateColumn()
  created: Date;

  // Does it need an updated field?
}
