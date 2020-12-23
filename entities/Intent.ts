import {
  Column, CreateDateColumn, Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
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

    @CreateDateColumn()
    created: Date;

    @UpdateDateColumn()
    updated: Date;
  }