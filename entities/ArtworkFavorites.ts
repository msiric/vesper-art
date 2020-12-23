import {
  Column, Entity,
  PrimaryGeneratedColumn
} from 'typeorm';
  
  @Entity()
  export class ArtworkFavorites {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    owner: null // $TODO

    @Column()
    artwork: null // $TODO

    @Column({ type: 'date' })
    created: Date;
  }