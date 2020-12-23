import {
  Column, CreateDateColumn, Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
  
  @Entity()
  export class Ticket {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    owner: null // $TODO
  
    @Column()
    title: string
  
    @Column()
    body: string
    
    @Column()
    attachment: string

    @Column()
    status: string

    @CreateDateColumn()
    created: Date;

    @UpdateDateColumn()
    updated: Date;
  }