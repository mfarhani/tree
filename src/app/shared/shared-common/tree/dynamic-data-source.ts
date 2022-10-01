import {CollectionViewer, SelectionChange} from '@angular/cdk/collections';
import {FlatTreeControl} from '@angular/cdk/tree';
import {BehaviorSubject, merge, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {DynamicFlatNode} from './dynamic-flat-node';
import {GetTreeDataCallback} from './tree.config';
import {ITreeNode} from './tree-node.interface';
import {TreeNode} from './tree-node.model';

class TreeStateService {
}

export class DynamicDataSource {
  dataChange: BehaviorSubject<DynamicFlatNode[]> = new BehaviorSubject<DynamicFlatNode[]>([]);

  get data(): DynamicFlatNode[] {
    return this.dataChange.value;
  }

  set data(value: DynamicFlatNode[]) {
    this.treeControl.dataNodes = value;
    this.dataChange.next(value);
  }

  constructor(
    private treeControl: FlatTreeControl<DynamicFlatNode>,
    private getTreeDataCallback: GetTreeDataCallback
  ) {
  }

  connect(collectionViewer: CollectionViewer): Observable<DynamicFlatNode[]> {
    this.treeControl.expansionModel.changed.subscribe((change: any) => {
      if (
        (change as SelectionChange<DynamicFlatNode>).added ||
        (change as SelectionChange<DynamicFlatNode>).removed
      ) {
        this.handleTreeControl(change as SelectionChange<DynamicFlatNode>);
      }
    });
    return merge(collectionViewer.viewChange, this.dataChange).pipe(
      map(() => this.data)
    );
  }

  /** Handle expand/collapse behaviors */
  handleTreeControl(change: SelectionChange<DynamicFlatNode>): void {
    if (change.added) {
      change.added.forEach((node) => this.toggleNode(node, true));
    }
    if (change.removed) {
      change.removed
        .slice()
        .reverse()
        .forEach((node) => this.toggleNode(node, false));
    }
  }

  /**
   * Toggle the node, remove from display list
   */
  toggleNode(node: DynamicFlatNode, expand: boolean): void {
    node.isLoading = true;
    let children: ITreeNode[];
    this.getTreeDataCallback(node).subscribe(
      (response: ITreeNode[]) => {
        // @ts-ignore
        children = response;
        const index = this.data.indexOf(node);
        if (!children || index < 0) {
          // If no children, or cannot find the node, no op
          return;
        }
        if (expand) {
          node.isExpanded = true;
          const nodes = children.map((child: ITreeNode, i: number) => {
            child.isLastChild = i === children.length - 1;
            child.parent = node.item;
            const dynamicNode = this.toDynamicFlatNode(child, node.level + 1);
            return dynamicNode;
          });
          this.data.splice(index + 1, 0, ...nodes);
        } else {
          node.isExpanded = false;
          let count = 0;
          for (
            let i = index + 1;
            i < this.data.length && this.data[i].level > node.level;
            i++, count++
          ) {
          }
          this.data.splice(index + 1, count);
        }
        // notify the change
        this.dataChange.next(this.data);
        node.isLoading = false;
      }
    );
  }

  public toDynamicFlatNode(node: ITreeNode, level: number): DynamicFlatNode {
    return new DynamicFlatNode(new TreeNode(node), level, node.expandable);
  }
}
