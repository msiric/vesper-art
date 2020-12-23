import {
  Column, CreateDateColumn, Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
  
  @Entity()
  export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

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

    @CreateDateColumn()
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

    @CreateDateColumn()
    created: Date;

    @UpdateDateColumn()
    updated: Date;
  }