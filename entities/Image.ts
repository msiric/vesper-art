import {
  Column, Entity,
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

    @Column({ type: 'date' })
    created: Date;
  }