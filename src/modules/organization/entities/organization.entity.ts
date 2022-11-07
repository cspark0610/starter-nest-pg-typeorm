import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { DateEntity, EmptyClass } from '~/common/entities';

import { User } from '~/modules/users/entities/user.entity';

@Entity('organization')
export class Organization extends DateEntity(EmptyClass) {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'subdomain', type: 'varchar', nullable: false, unique: true })
  subdomain: string;

  @Column({ name: 'aws_s3_bucket', type: 'varchar', nullable: false })
  aws_s3_bucket: string;

  /* ======= RELATIONS ======= */
  @OneToOne(() => User, (user) => user.organization)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;
}
