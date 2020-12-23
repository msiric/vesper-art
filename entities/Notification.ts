import {
  Column, Entity,
  PrimaryGeneratedColumn
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

    @Column({ type: 'date' })
    created: Date;
  }