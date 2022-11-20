import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
} from "typeorm";

export enum MediaOrientation {
  square = "square",
  portrait = "portrait",
  landscape = "landscape",
}

@Entity()
export class Media extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  @Generated("increment")
  serial: number;

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

  @Column({ default: false })
  generated: boolean;

  @CreateDateColumn({ type: "timestamptz" })
  created: Date;
}
