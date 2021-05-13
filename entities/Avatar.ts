import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

export enum AvatarOrientation {
  square = "square",
  portrait = "portrait",
  landscape = "landscape",
}

@Entity()
export class Avatar extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  @Generated("increment")
  serial: number;

  @OneToOne(() => User)
  owner: User;

  // $TODO remove nullable
  @Column({ nullable: true })
  ownerId: string;

  @Column()
  source: string;

  @Column({
    type: "enum",
    enum: AvatarOrientation,
  })
  orientation: AvatarOrientation;

  @Column()
  dominant: string;

  @Column()
  height: string;

  @Column()
  width: string;

  @CreateDateColumn({ type: "timestamptz" })
  created: Date;
}
