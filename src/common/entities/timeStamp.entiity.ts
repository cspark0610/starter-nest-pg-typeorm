/* eslint-disable max-classes-per-file */
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export type Constructor<T = object> = new (...args: any[]) => T;

export function DateEntity<TBase extends Constructor>(Base: TBase) {
  abstract class TimeStampBase extends Base {
    @CreateDateColumn({ name: 'created_at', type: 'timestamp', select: false })
    created: Date;

    @UpdateDateColumn({ name: 'created_at', type: 'timestamp', select: false })
    updated: Date;
  }
  return TimeStampBase;
}

export class EmptyClass {}
