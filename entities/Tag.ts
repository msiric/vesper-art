import {
    Column, Entity,
    PrimaryGeneratedColumn
} from 'typeorm';
  
  @Entity()
  export class Tag {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string

    @Column({ type: 'date' })
    created: Date;
  }