import {FlatTreeControl} from '@angular/cdk/tree';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {map, take} from 'rxjs/operators';
import {DynamicDataSource} from './dynamic-data-source';
import {DynamicFlatNode} from './dynamic-flat-node';
import {ITreeConfig} from './tree.config';
import {ITreeNode} from './tree-node.interface';

@Component({
  selector: 'mf-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit {
  @Input() treeConfig!: ITreeConfig;
  @Input() selectedNodeIds?: string[];
  @Output() nodeClick: EventEmitter<ITreeNode> = new EventEmitter<ITreeNode>();
  @Output() goRoot: EventEmitter<void> = new EventEmitter<void>();
  public toggleSearch = true;
  public filter = '';
  public searchMode = false;
  public options!: any[];
  public treeControl: FlatTreeControl<DynamicFlatNode>;
  public dataSource!: any;
  private searchLevels!: number[];
  public emptyNodeParentId!: number;
  public searchKeys: any = [];
  private selectedNodeList: ITreeNode[] = [];

  /**
   *
   * @param modalService as MatDialog service
   */
  constructor(
    private modalService: MatDialog
  ) {
    this.treeControl = new FlatTreeControl<DynamicFlatNode>(
      this.getLevel,
      this.isExpandable
    );
  }

  getLevel = (node: DynamicFlatNode) => node.level;
  isExpandable = (node: DynamicFlatNode) => node.expandable;
  // tslint:disable-next-line:variable-name
  hasChild = (_: number, _nodeData: DynamicFlatNode) => _nodeData.expandable;

  ngOnInit(): void {
    // this.treeService.endpoint = this.treeConfig.endpoint;
    this.dataSource = new DynamicDataSource(
      this.treeControl,
      this.treeConfig.getTreeDataCallback
    );
    this.getRoot();
  }

  private checkSelected(node: ITreeNode): void {
    if (this.selectedNodeIds?.includes(node?.item?.id)) {
      node.selected = true;
      this.selectedNodeList.push(node.item);
    }
  }

  private getRoot(): void {
    this.treeConfig
      .getTreeDataCallback()
      .subscribe((rootNodes: ITreeNode[]) => {
        // @ts-ignore
        const rootNodesList = rootNodes.filter((node: ITreeNode) => {
          return !node.parentId;
        });
        if (this.dataSource && rootNodesList) {
          this.dataSource.data = rootNodesList.map((node: ITreeNode) =>
            this.dataSource.toDynamicFlatNode(node, 0)
          );
          if (this.selectedNodeIds) {
            this.dataSource.data.map((d: ITreeNode) => this.checkSelected(d));
          }
        }
        console.log(this.dataSource);
      });
  }

  /**
   *
   * @param node as parent node to load its children
   */
  loadChildren(node?: DynamicFlatNode): void {
    // @ts-ignore
    node.isLoading = true;
    let children: ITreeNode[];
    this.treeConfig
      .getTreeDataCallback(node)
      .subscribe((response: ITreeNode[]) => {
        children = response;
        const index = this.dataSource.data.indexOf(node);
        if (!children) {
          // If no children, or cannot find the node, no op
          return;
        }
        const nodes = children.map((child: ITreeNode) =>
          this.dataSource.toDynamicFlatNode(child, node ? node.level : 0)
        );
        this.dataSource.data.splice(this.dataSource.data.length, 0, ...nodes);
        this.dataSource.dataChange.next(this.dataSource.data);
        // @ts-ignore
        node.isLoading = false;
      });
  }

  public collapseAll(): void {
    this.treeControl.collapseAll();
    this.goRoot.emit();
  }

  public onNodeClick(node: ITreeNode): void {
    this.nodeClick.emit(node);
  }

  public loadMore(node: DynamicFlatNode): void {
    this.loadChildren(node);
  }

  public isLastChild(node: any): boolean {
    // tslint:disable-next-line:variable-name
    const siblingNodes = this.dataSource.data.filter(
      (_node: DynamicFlatNode) => _node.item.parentId === node.item.parentId
    );
    return siblingNodes.indexOf(node) === siblingNodes.length - 1;
  }

  public isWithinExpandedArea(node: any): boolean {
    return node.item?.parentId || node.isExpanded;
  }

  // TODO: Implement search method
  public searchTree(searchKey: string): void {
    if (!searchKey || searchKey === '') {
      this.getRoot();
    } else {
      this.treeConfig
        .getTreeSearchDataCallback(searchKey)
        .pipe(
          take(1),
          map((res) => {
            if (this.treeConfig.parentIdKey) {
              // @ts-ignore
              res.forEach((r) => (r.parentId = r[this.treeConfig.parentIdKey]));
            }
            return res;
          })
        )
        .subscribe((res: ITreeNode[]) => {
          this.searchMode = true;
          // @ts-ignore
          const result = res;
          const nodes = result;
          const treeData = result
            .filter((node: ITreeNode) => !node.parentId)
            .map((node: ITreeNode) => {
              // set parentNode level
              node.level = 0;
              return node;
            });
          result.forEach((node) => {
            if (treeData.findIndex((td) => td.id === node.id) < 0) {
              this.findParent(node, nodes, treeData);
            }
          });
          result.forEach((node) => {
            if (treeData.findIndex((td) => td.id === node.id) < 0) {
              this.findParent(node, nodes, treeData);
            }
          });
          this.dataSource.data = treeData.map((d: ITreeNode) => {
            const sibling = treeData.filter(
              (td: ITreeNode) => td.parentId === d.parentId
            );
            d.isLastChild =
              sibling.findIndex((s) => d.id === s.id) === sibling.length - 1;
            return this.dataSource.toDynamicFlatNode(d, d.level);
          });
          console.log(this.dataSource.data);
        });
    }
  }

  search(searchKey: string): void {
    this.searchKeys.push(searchKey);
    setTimeout(() => {
      if (this.searchKeys[this.searchKeys.length - 1] === searchKey) {
        this.searchTree(searchKey);
      }
    }, 500);
  }

  findParent(
    node: ITreeNode,
    sourceList: ITreeNode[],
    destinationList: ITreeNode[]
  ): void {
    if (node.parentId) {
      const parentNode = sourceList.find(
        (td: ITreeNode) => td.id === node.parentId
      );
      node.parent = parentNode;
      // @ts-ignore
      node.level = parentNode && parentNode.level + 1;
      if (destinationList.findIndex((f) => f.id === node.parentId) > -1) {
        if (destinationList.findIndex((f) => f.id === node.id) < 0) {
          destinationList.splice(
            destinationList.findIndex(
              (f: ITreeNode) => f.id === node.parentId
            ) + 1,
            0,
            ...[node]
          );
        }
      } else if (node.parent) {
        this.findParent(node.parent, sourceList, destinationList);
      }
    }
  }

  public closeSearch(): void {
    this.filter = '';
    this.searchMode = false;
    this.getRoot();
  }

  public getAncestor(node: ITreeNode): ITreeNode[] {
    const ancestor = [];
    let parent = node.parent;
    ancestor.push(node);
    while (parent) {
      if (parent.isRoot) {
        // @ts-ignore
        parent = null;
      } else {
        ancestor.push(parent);
        parent = parent.parent;
      }
    }
    return ancestor;
  }

  onAddClicked(node: ITreeNode): void {
    // @ts-ignore
    this.emptyNodeParentId = node.item.id;
  }

  onDeleteClicked(node: ITreeNode): void {
    if (this.treeConfig?.treeDeleteCallBack) {
      this.treeConfig.treeDeleteCallBack(node.item.id).subscribe((res) => {
        if (res) {
          const nodeIndex = this.dataSource.data.findIndex((x: any) => {
            return x.item.id === node.item.id;
          });
          this.dataSource.data.splice(nodeIndex, 1);
          this.dataSource.dataChange.next(this.dataSource.data);
        }
      });
    }
  }

  onEditClicked(node: ITreeNode): void {
    if (this.treeConfig.treeEditCallBack) {
      this.treeConfig?.treeEditCallBack(node.item);
    }
  }

  selectNodeChange(node: ITreeNode): void {
    node.selected = !node.selected;
    if (node.selected) {
      this.selectedNodeList.push(node.item);
    } else {
      this.selectedNodeList.splice(
        this.selectedNodeList.findIndex((i) => i.id === node.item.id),
        1
      );
    }
    if (this.treeConfig.treeSelectCallBack) {
      this.treeConfig?.treeSelectCallBack(this.selectedNodeList);
    }
  }
}
