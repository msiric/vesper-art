import {
  Column, CreateDateColumn, Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
  
  @Entity()
  export class Comment {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    owner: null // $TODO;
  
    @Column()
    artwork: null // $TODO;
  
    @Column()
    content: string;

    @Column()
    modified: boolean;

    @Column()
    generated: boolean;

    @CreateDateColumn()
    created: Date;

    @UpdateDateColumn()
    updated: Date;
  }