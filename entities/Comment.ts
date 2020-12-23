import {
    Column, Entity,
    PrimaryGeneratedColumn
} from 'typeorm';
  
  @Entity()
  export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    owner: null // $TODO;
  
    @Column()
    artwork: null // $TODO;
  
    @Column()
    content: string;

    @Column()
    modified: boolean;

    @Column()
    generated: boolean;

    @Column({ type: 'date' })
    created: Date;
  }