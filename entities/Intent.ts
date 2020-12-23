import {
  Column, Entity,
  PrimaryGeneratedColumn
} from 'typeorm';
  
  @Entity()
  export class Intent {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    owner: null // TODO
  
    @Column()
    version: null // TODO
  
    @Column()
    uuid: string;

    @Column({ type: 'date' })
    created: Date;
  }