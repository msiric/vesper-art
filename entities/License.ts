import {
  AfterLoad,
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { formatAmount } from "../common/helpers";
import { Artwork } from "./Artwork";
import { User } from "./User";

export enum LicenseType {
  personal = "personal",
  commercial = "commercial",
}

export enum LicenseUsage {
  individual = "individual",
  business = "business",
}

@Entity()
export class License extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  @Generated("increment")
  serial: number;

  @ManyToOne(() => User, (user) => user.buyerLicenses)
  owner: User;

  @Column()
  ownerId: string;

  @ManyToOne(() => User, (user) => user.sellerLicenses)
  seller: User;

  @Column()
  sellerId: string;

  @ManyToOne(() => Artwork, (artwork) => artwork.licenses)
  @JoinColumn()
  artwork: Artwork;

  @Column()
  artworkId: string;

  @Column()
  fingerprint: string;

  @Column()
  assignee: string;

  @Column()
  assigneeIdentifier: string;

  @Column()
  assignor: string;

  @Column()
  assignorIdentifier: string;

  @Column()
  company: string;

  @Column({
    type: "enum",
    enum: LicenseType,
  })
  type: LicenseType;

  // $TODO temp nullable, remove later
  @Column({
    type: "enum",
    enum: LicenseUsage,
    nullable: true,
  })
  usage: LicenseUsage;

  @Column()
  active: boolean;

  @Column()
  price: number;

  @CreateDateColumn({ type: "timestamptz" })
  created: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updated: Date;

  @AfterLoad()
  correctAmount() {
    this.price = formatAmount(this.price).value;
  }
}
