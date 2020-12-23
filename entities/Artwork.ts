import {
  Column, CreateDateColumn, Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
  
  @Entity()
  export class Artwork {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    owner: null // $TODO;
  
    @Column()
    current: null // $TODO;
  
    @Column()
    favorites: number;

    @Column()
    active: boolean;

    @Column()
    generated: boolean;

    @CreateDateColumn()
    created: Date;

    @UpdateDateColumn()
    updated: Date;
  }