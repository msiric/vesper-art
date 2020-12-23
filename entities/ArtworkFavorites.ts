import {
  Column, CreateDateColumn, Entity,
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

    @CreateDateColumn()
    created: Date;

    // Does it need an updated field?
  }