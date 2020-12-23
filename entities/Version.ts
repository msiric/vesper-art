import {
  Column, Entity,
  PrimaryGeneratedColumn
} from 'typeorm';
  
  @Entity()
  export class Version {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    artwork: null // $TODO
  
    @Column()
    title: string
  
    @Column()
    category: string
    
    @Column()
    description: string

    @Column()
    license: string

    @Column()
    use: string
    
    @Column()
    personal: number

    @Column()
    commercial: number

    @Column()
    availability: string
    
    @Column()
    cover: null // $TODO

    @Column()
    media: null // $TODO

    @Column({ type: 'date' })
    created: Date;
  }