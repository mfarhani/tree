import {IProject} from './project.interface';
import {ID} from '../../../core/base-models/base-model.interface';
import {ITask} from './task.interface';

export class Project implements IProject {
  constructor(
    public id?: ID,
    public name?: string,
    public tasks?: ITask[]
  ) {
  }

  public toString(): string {
    return this.name || '';
  }
}
