import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

export enum MediaOrientation {
  SQUARE = "square",
  PORTRAIT = "portrait",
  LANDSCAPE = "landscape",
}

@Entity()
export class Media extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  source: string;

  @Column({
    type: "enum",
    enum: MediaOrientation,
  })
  orientation: MediaOrientation;

  @Column()
  dominant: string;

  @Column()
  height: string;

  @Column()
  width: string;

  @CreateDateColumn()
  created: Date;
}
