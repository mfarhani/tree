import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ITreeNode} from '../tree-node.interface';
import {ITreeConfig} from '../tree.config';

@Component({
  selector: 'mf-tree-node-actions',
  templateUrl: './tree-node-actions.component.html',
  styleUrls: ['./tree-node-actions.component.scss']
})
export class TreeNodeActionsComponent {
  @Input() currentNode!: ITreeNode;
  @Input() treeConfig!: ITreeConfig;
  @Output() onAdd: EventEmitter<ITreeNode> = new EventEmitter<ITreeNode>();
  @Output() onDelete: EventEmitter<ITreeNode> = new EventEmitter<ITreeNode>();
  @Output() onEdit: EventEmitter<ITreeNode> = new EventEmitter<ITreeNode>();
  public nodeData!: ITreeNode;

  constructor() {
  }

  onAddClick(): void {
    this.onAdd.emit(this.currentNode);
    if (this.treeConfig.treeAddCallBack) {
      this.treeConfig
        .treeAddCallBack(this.currentNode.item)
        ?.subscribe((res: any) => {
        });
    }
  }

  onDeleteClick(): void {
    if (this.treeConfig.treeDeleteCallBack) {
      this.onDelete.emit();
    }
  }

  onEditClick(): void {
    if (this.treeConfig.treeEditCallBack) {
      this.onEdit.emit(this.currentNode);
    }
  }
}
