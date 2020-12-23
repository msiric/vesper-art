import {
  Column, CreateDateColumn, Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
  
  @Entity()
  export class Notification {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    receiver: null // $TODO
  
    @Column()
    link: string;
  
    @Column()
    ref: string;
    
    @Column()
    type: string;

    @Column()
    read: boolean;

    @CreateDateColumn()
    created: Date;

    @UpdateDateColumn()
    updated: Date;
  }