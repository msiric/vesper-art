import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
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

  @OneToOne(() => Artwork, (artwork) => artwork.current, {
    onDelete: "CASCADE",
  })
  artwork: Artwork;

  @Column()
  title: string;

  @Column()
  category: string;
  // $TODO not implemented
  @ManyToMany(() => Tag, (tag) => tag.id, { cascade: ["insert"] })
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

  @OneToOne(() => Cover, (cover) => cover.version, { cascade: ["insert"] })
  @JoinColumn()
  cover: Cover;

  @OneToOne(() => Media, (media) => media.version, { cascade: ["insert"] })
  @JoinColumn()
  media: Media;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
