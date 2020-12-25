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
import { Artwork } from "./Artwork";
import { Cover } from "./Cover";
import { Media } from "./Media";
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

  @OneToOne(() => Cover, (cover) => cover.version)
  @JoinColumn()
  cover: Cover;

  @OneToOne(() => Media, (media) => media.version)
  @JoinColumn()
  media: Media;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
