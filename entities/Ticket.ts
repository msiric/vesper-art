import {
    Column, Entity,
    PrimaryGeneratedColumn
} from 'typeorm';
  
  @Entity()
  export class Ticket {
    @PrimaryGeneratedColumn()
    id: number;

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

    @Column({ type: 'date' })
    created: Date;
  }