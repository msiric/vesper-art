import {
  AfterLoad,
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
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

@Entity()
export class License extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User)
  owner: User;

  @Column()
  ownerId: string;

  @ManyToOne(() => Artwork)
  @JoinColumn()
  artwork: Artwork;

  @Column()
  artworkId: string;

  @Column()
  fingerprint: string;

  @Column()
  assignee: string;

  @Column()
  company: string;

  @Column({
    type: "enum",
    enum: LicenseType,
  })
  type: LicenseType;

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
