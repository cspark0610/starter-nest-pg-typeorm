import { BadRequestException } from '@nestjs/common';
import {
  // AbstractRepository,
  DeleteResult,
  ObjectLiteral,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';

export abstract class BaseRepository<
  T extends ObjectLiteral,
> extends Repository<T> {
  getQueryBuilder(): SelectQueryBuilder<T> {
    return this.createQueryBuilder();
  }

  async findAll(where: Partial<T> = {}): Promise<Array<T>> {
    return this.getQueryBuilder().where(where).getMany();
  }

  async findOneBy(where: Partial<T> = {}): Promise<T> {
    const result = await this.getQueryBuilder().where(where).getOne();
    if (!result) {
      throw new BadRequestException(`${this.metadata.name} not Found.`);
    }
    return result;
  }

  async createSingle(data: Partial<T>): Promise<T> {
    return this.save(this.create(data));
  }

  async createMany(data: Array<Partial<T>>): Promise<Array<T>> {
    return this.save(this.create(data));
  }

  async updateSingle(id: number, data: Partial<T>): Promise<ObjectLiteral[]> {
    const result = await this.update(id, data);
    return result.generatedMaps;
  }

  // async updateMany(ids: Array<number>, data: Partial<T>): Promise<Array<T>> {
  //   await Promise.all(ids.map((id) => this.repository.save({ id, ...data })));
  //   return Promise.all(
  //     ids.map((id) => this.findOneBy({ id } as unknown as Partial<T>)),
  //   );
  // }

  async deleteSingle(
    id: number | Array<number>,
  ): Promise<DeleteResult['affected']> {
    const result = await this.delete(id);
    return result.affected;
  }
}
