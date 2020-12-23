import {
    Column, Entity,
    PrimaryGeneratedColumn
} from 'typeorm';
  
  @Entity()
  export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;
  
    @Column()
    name: string;
  
    @Column()
    password: string;

    @Column()
    avatar: null // TODO;

    @Column()
    description: string;

    @Column()
    country: string;

    @Column()
    businessAddress: string;

    @Column()
    customWork: boolean;

    @Column()
    displayFavorites: boolean;

    @Column()
    resetToken: string;

    @Column({ type: 'date' })
    resetExpiry: Date;

    @Column()
    jwtVersion: number;

    @Column()
    stripeId: string;

    @Column()
    verificationToken: string;

    @Column()
    verified: boolean;

    @Column()
    active: boolean;

    @Column()
    generated: boolean;

    @Column({ type: 'date' })
    created: Date;
  }