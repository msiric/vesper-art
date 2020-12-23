import {
  Column, CreateDateColumn, Entity,
  PrimaryGeneratedColumn
} from 'typeorm';
  
  @Entity()
  export class Image {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    type: string
  
    @Column()
    source: string
  
    @Column()
    orientation: string;

    @Column()
    dominant: string;

    @Column()
    height: string;

    @Column()
    width: string;

    @CreateDateColumn()
    created: Date;

    // Does it need an updated field?
  }