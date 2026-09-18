import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class DemoUpload {
  @PrimaryGeneratedColumn('uuid') id: string;
  @ManyToOne(() => User, { onDelete: 'CASCADE' }) owner: User;
  @Column() ownerId: string;
  @Column() mimeType: string;
  @Column({ type: 'bytea', select: false }) content: Buffer;
  @Column() bytes: number;
  @CreateDateColumn({ type: 'timestamptz' }) created: Date;
}
