import {ID} from '../../../core/base-models/base-model.interface';
import {ITask} from './task.interface';

export class Task implements ITask {
  constructor(
    public id?: ID,
    public name?: string,
    public status?: string,
    public description?: string,
    public parentId?: ID
  ) {
  }

  toString(): string {
    return this.name || '';
  }

}
