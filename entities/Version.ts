import {
  AfterLoad,
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { formatAmount } from "../common/helpers";
import { Artwork } from "./Artwork";
import { Cover } from "./Cover";
import { Media } from "./Media";
import { Tag } from "./Tag";

@Entity()
export class Version extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => Artwork, (artwork) => artwork.current)
  artwork: Artwork;

  @Column()
  artworkId: string;

  @Column()
  title: string;

  @Column({ nullable: true })
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

  @ManyToOne(() => Cover)
  cover: Cover;

  @Column()
  coverId: string;

  @ManyToOne(() => Media)
  media: Media;

  @Column()
  mediaId: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @AfterLoad()
  correctAmount() {
    this.personal = formatAmount(this.personal).intValue;
    this.commercial = formatAmount(this.commercial).intValue;
  }
}
