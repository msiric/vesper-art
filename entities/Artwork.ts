import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Version } from "./Version";

export enum ArtworkVisibility {
  visible = "visible",
  invisible = "invisible",
}

@Entity()
export class Artwork extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  @Generated("increment")
  serial: number;

  @ManyToOne(() => User)
  owner: User;

  @Column()
  ownerId: string;

  @OneToOne(() => Version)
  @JoinColumn()
  current: Version;

  @Column({ nullable: true })
  currentId: string;

  @Column()
  active: boolean;

  @Column({
    type: "enum",
    enum: ArtworkVisibility,
  })
  visibility: ArtworkVisibility;

  @Column()
  generated: boolean;

  @CreateDateColumn({ type: "timestamptz" })
  created: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updated: Date;
}
