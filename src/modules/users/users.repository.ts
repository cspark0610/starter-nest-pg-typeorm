import { EntityRepository, SelectQueryBuilder } from 'typeorm';

import { BaseRepository } from '~/common/repositories/base.repository';

import { User } from './entities/user.entity';

@EntityRepository(User)
export class UsersRepository extends BaseRepository<User> {}
