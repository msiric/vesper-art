import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Art } from "./Art";
import { Artwork } from "./Artwork";

@Entity()
export class Version extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => Artwork)
  @JoinColumn()
  artwork: Artwork;

  @Column()
  title: string;

  @Column()
  category: string;

  @Column()
  description: string;

  @Column()
  license: string;

  @Column()
  use: string;

  @Column()
  personal: number;

  @Column()
  commercial: number;

  @Column()
  availability: string;

  @OneToOne(() => Art)
  @JoinColumn()
  cover: Art;

  @OneToOne(() => Art)
  @JoinColumn()
  media: Art;

  @CreateDateColumn()
  created: Date;

  // Does it need an updated field?
}
