import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IProject} from '../models/project.interface';
import {Observable} from 'rxjs';
import {ID} from '../../../core/base-models/base-model.interface';
import {map} from 'rxjs/operators';
import {DynamicFlatNode} from '../../../shared/shared-common/tree/dynamic-flat-node';
import {ITask} from '../models/task.interface';
import {Optional} from '../../../core/type-guards/optional';

@Injectable({providedIn: 'root'})
export class ProjectListService {
  constructor(private http: HttpClient) {
  }

  public create(model: IProject): void {

  }

  public read(node?: DynamicFlatNode, search?: string): Observable<IProject[] | Optional<ITask>[]> {
    return this.http.get<IProject[] | Optional<ITask[]>>('assets/mocks/projects.json', {observe: 'response'})
      .pipe(map((res: any) => search ? this.mapSearchResult(res?.body?.projects, search) : this.mapJson2Model(res?.body?.projects, node)));
  }

  public update(model: IProject): void {

  }

  public delete(id: ID): void {

  }

  private mapJson2Model(projects: IProject[], node?: DynamicFlatNode): IProject[] | Optional<ITask>[] {
    if (node) {
      if (node.level === 0) {
        return projects.find(p => p.id === node?.item?.id)?.tasks || [];
      } else {
        let tasks: Optional<ITask[]> = [];
        projects.forEach(p => {
          if (node?.item?.id && p.tasks) {
            p.tasks.forEach(t => {
              if (tasks && tasks?.length < 1) {
                tasks = this.getChildrenByParentId(node.item.id as ID, t);
              }
            });
          }
        });
        return tasks;
      }
    } else {
      return projects.map(p => {
        delete p.tasks;
        return p;
      });
    }
  }

  private getChildrenByParentId(parentId: ID, task: ITask): Optional<ITask[]> {
    if (task.id === parentId) {
      return task.children;
    } else if (task.children) {
      task.children.forEach(tc => {
        return this.getChildrenByParentId(parentId, tc);
      });
    }
    return [];
  }

  private mapSearchResult(projects: any, search: string): IProject[] | Optional<ITask>[] {
    const list: Optional<ITask>[] = [];
    projects.forEach((p: IProject) => {
      if (p.tasks && p.tasks?.length > 0) {
        p.tasks?.forEach(t => {
          if (t.children && t.children?.length > 0) {
            t.children.forEach(tc => {
              this.getChildren(list, tc, t.id);
            });
          }
          t.parentId = p.id;
          delete t.children;
          list.push(t as ITask);
        });
      }
      delete p.tasks;
      list.push(p);
    });
    return list.filter((l: any) => l.name.toLowerCase()?.includes(search.toLowerCase()));
  }

  private getChildren(list: IProject[] | Optional<ITask>[], task: ITask, parentId?: ID): void {
    if (task.children && task.children.length > 0) {
      return this.getChildren(list, task.children, parentId);
    } else {
      task.parentId = parentId;
      delete task.children;
      list.push(task);
    }
  }
}
