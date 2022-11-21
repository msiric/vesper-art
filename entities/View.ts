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
export class View extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  @Generated("increment")
  serial: number;

  @Column()
  ip: string;

  @ManyToOne(() => User, (user) => user.views)
  owner: User;

  @Column({ nullable: true })
  ownerId: string;

  @ManyToOne(() => Artwork, (artwork) => artwork.views)
  artwork: Artwork;

  @Column()
  artworkId: string;

  @Column({ default: false })
  generated: boolean;

  @CreateDateColumn({ type: "timestamptz" })
  created: Date;
}
