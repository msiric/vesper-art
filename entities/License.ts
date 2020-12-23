import {
  Column, CreateDateColumn, Entity,
  PrimaryGeneratedColumn
} from 'typeorm';
  
  @Entity()
  export class License {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    owner: null // $TODO
  
    @Column()
    artwork: null // $TODO
  
    @Column()
    fingerprint: string;
    
    @Column()
    assignee: string;

    @Column()
    company: string;

    @Column()
    text: string;

    @Column()
    active: boolean;

    @Column()
    price: number;

    @CreateDateColumn()
    created: Date;

    // Does it need an updated field?
  }