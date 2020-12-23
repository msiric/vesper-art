import {
  Column, CreateDateColumn, Entity,
  PrimaryGeneratedColumn
} from 'typeorm';
  
  @Entity()
  export class Tag {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    title: string

    @CreateDateColumn()
    created: Date;
  }