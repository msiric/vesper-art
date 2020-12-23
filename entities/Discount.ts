import {
  Column, CreateDateColumn, Entity,
  PrimaryGeneratedColumn
} from 'typeorm';
  
  @Entity()
  export class Discount {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string
  
    @Column()
    discount: number
  
    @Column()
    active: boolean;

    @CreateDateColumn()
    created: Date;
  }