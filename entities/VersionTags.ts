import {
    Column, Entity,
    PrimaryGeneratedColumn
} from 'typeorm';
  
  @Entity()
  export class VersionTags {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    version: null // $TODO

    @Column()
    tag: null // $TODO

    @Column({ type: 'date' })
    created: Date;
  }