import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { User } from './entities/user.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  getQueryBuilder(): SelectQueryBuilder<User> {
    return this.repository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.organization', 'organization');
  }

  findAll(where: Partial<User> = {}): Promise<Array<User>> {
    return this.getQueryBuilder().where(where).getMany();
  }

  findOneById(id: number): Promise<User> {
    return this.repository.findOne({ id });
  }

  findOneBy(where: Partial<User> = {}): Promise<User> {
    const { email } = where;
    return this.repository.findOne({ email });
  }

  async createSingle(data: Partial<User>): Promise<User> {
    const user = await this.repository.save(this.repository.create(data));
    delete user.password;
    return user;
  }

  createMany(data: Array<Partial<User>>): Promise<Array<User>> {
    return this.repository.save(this.repository.create(data));
  }

  updateSingle(id: number, data: Partial<User>) {
    return this.repository.update(id, data);
  }

  async deleteSingle(id: number | Array<number>): Promise<number> {
    const result = await this.repository.delete(id);
    return result.affected;
  }
}
