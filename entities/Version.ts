import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Art } from "./Art";
import { Artwork } from "./Artwork";
import { Tag } from "./Tag";

@Entity()
export class Version extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Artwork, (artwork) => artwork.versions)
  artwork: Artwork;

  @Column()
  title: string;

  @Column()
  category: string;

  @ManyToMany(() => Tag, (tag) => tag.id)
  @JoinTable()
  tags: Tag[];

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

  @UpdateDateColumn()
  updated: Date;
}
