import {
    Column, Entity,
    PrimaryGeneratedColumn
} from 'typeorm';
  
  @Entity()
  export class Review {
    @PrimaryGeneratedColumn()
    id: number;

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