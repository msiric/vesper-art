import {
  Column, CreateDateColumn, Entity,
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

    @CreateDateColumn()
    created: Date;
  }