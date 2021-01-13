import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
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

  @OneToOne(() => User)
  owner: User;

  @Column()
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
