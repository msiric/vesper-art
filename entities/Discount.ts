import {
    Column, Entity,
    PrimaryGeneratedColumn
} from 'typeorm';
  
  @Entity()
  export class Discount {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string
  
    @Column()
    discount: number
  
    @Column()
    active: boolean;

    @Column({ type: 'date' })
    created: Date;
  }