import {
  Column, Entity,
  PrimaryGeneratedColumn
} from 'typeorm';
  
  @Entity()
  export class Review {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    order: null // $TODO
  
    @Column()
    artwork: null // $TODO
  
    @Column()
    owner: null // $TODO
    
    @Column()
    rating: number

    @Column({ type: 'date' })
    created: Date;
  }