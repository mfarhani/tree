import {IBaseModel} from '../../../core/base-models/base-model.interface';
import {ITask} from './task.interface';

export interface IProject extends IBaseModel {
  tasks?: ITask[];
}
