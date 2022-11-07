/* eslint-disable @typescript-eslint/no-unsafe-return */
import { genSaltSync, hashSync } from 'bcrypt';
import { Exclude } from 'class-transformer';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { DateEntity, EmptyClass } from '~/common/entities';

import { Organization } from '~/modules/organization/entities/organization.entity';

@Entity('users')
export class User extends DateEntity(EmptyClass) {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  lastName: string;

  @Column({ type: 'varchar', nullable: true })
  phone?: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  @Exclude()
  password: string;

  /* ======= RELATIONS ======= */
  @OneToOne(() => Organization, (org) => org.user, {
    cascade: ['insert', 'remove'],
  })
  organization: Organization;

  /* ========= HOOKS ========= */
  @BeforeInsert()
  @BeforeUpdate()
  hashPassword() {
    if (this.password) this.password = hashSync(this.password, genSaltSync(10));
  }
}
