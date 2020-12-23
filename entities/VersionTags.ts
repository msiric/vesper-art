import {
  Column, Entity,
  PrimaryGeneratedColumn
} from 'typeorm';
  
  @Entity()
  export class VersionTags {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    version: null // $TODO

    @Column()
    tag: null // $TODO

    @Column({ type: 'date' })
    created: Date;
  }