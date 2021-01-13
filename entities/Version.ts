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

export enum VersionAvailability {
  available = "available",
  unavailable = "unavailable",
}

export enum VersionType {
  free = "free",
  commercial = "commercial",
  unavailable = "unavailable",
}

export enum VersionLicense {
  personal = "personal",
  commercial = "commercial",
  unavailable = "unavailable",
}

export enum VersionUse {
  separate = "separate",
  included = "included",
  unavailable = "unavailable",
}

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

  // $TODO not implemented
  @Column({ nullable: true })
  category: string;

  // $TODO not implemented
  @ManyToMany(() => Tag, (tag) => tag.id, { cascade: ["insert"] })
  @JoinTable()
  tags: Tag[];

  @Column()
  description: string;

  @Column({
    type: "enum",
    enum: VersionAvailability,
  })
  availability: VersionAvailability;

  @Column({
    type: "enum",
    enum: VersionType,
  })
  type: VersionType;

  @Column({
    type: "enum",
    enum: VersionLicense,
  })
  license: VersionLicense;

  @Column({
    type: "enum",
    enum: VersionUse,
  })
  use: VersionUse;

  @Column()
  personal: number;

  @Column()
  commercial: number;

  @ManyToOne(() => Cover)
  cover: Cover;

  @Column()
  coverId: string;

  @ManyToOne(() => Media)
  media: Media;

  @Column()
  mediaId: string;

  @CreateDateColumn({ type: "timestamptz" })
  created: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updated: Date;

  @AfterLoad()
  correctAmount() {
    this.personal = formatAmount(this.personal).value;
    this.commercial = formatAmount(this.commercial).value;
  }
}
