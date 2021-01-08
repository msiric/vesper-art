import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

export enum CoverOrientation {
  SQUARE = "square",
  PORTRAIT = "portrait",
  LANDSCAPE = "landscape",
}

@Entity()
export class Cover extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  source: string;

  @Column({
    type: "enum",
    enum: CoverOrientation,
  })
  orientation: CoverOrientation;

  @Column()
  dominant: string;

  @Column()
  height: string;

  @Column()
  width: string;

  @CreateDateColumn()
  created: Date;
}
