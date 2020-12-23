import {
  Column, Entity,
  PrimaryGeneratedColumn
} from 'typeorm';
  
  @Entity()
  export class Order {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    buyer: null // $TODO
  
    @Column()
    seller: null // $TODO
  
    @Column()
    artwork: null // $TODO
    
    @Column()
    version: null // $TODO

    @Column()
    license: null // $TODO

    @Column()
    discount: null // $TODO

    @Column()
    review: null // $TODO

    @Column()
    intent: null // $TODO

    @Column()
    spent: number

    @Column()
    earned: number

    @Column()
    fee: number

    @Column()
    commercial: boolean

    @Column()
    status: string

    @Column({ type: 'date' })
    created: Date;
  }