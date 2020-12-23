import {
    Column, Entity,
    PrimaryGeneratedColumn
} from 'typeorm';
  
  @Entity()
  export class Artwork {
    @PrimaryGeneratedColumn()
    id: number;

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

    @Column({ type: 'date' })
    created: Date;
  }