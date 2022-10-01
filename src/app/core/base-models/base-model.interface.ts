export interface IBaseModel {
  id?: ID;
  name?: string;

  toString(): string;
}

export type ID = number | string;
