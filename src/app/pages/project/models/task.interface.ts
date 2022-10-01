import {IBaseModel, ID} from '../../../core/base-models/base-model.interface';

export interface ITask extends IBaseModel {
  status?: string;
  description?: string;
  children?: ITask[];
  parentId?: ID;
}
