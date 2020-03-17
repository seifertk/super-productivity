import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {IS_ELECTRON} from '../../../../app.constants';
import {TaskAttachmentCopy, TaskAttachmentType} from '../task-attachment.model';
import {T} from '../../../../t.const';
import {TranslateService} from '@ngx-translate/core';

interface TaskAttachmentSelectType {
  type: TaskAttachmentType;
  title: string;
}

@Component({
  selector: 'dialog-edit-task-attachment',
  templateUrl: './dialog-edit-task-attachment.component.html',
  styleUrls: ['./dialog-edit-task-attachment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogEditTaskAttachmentComponent implements OnInit {
  types: TaskAttachmentSelectType[];
  attachmentCopy: TaskAttachmentCopy;
  T = T;

  constructor(
    private _matDialogRef: MatDialogRef<DialogEditTaskAttachmentComponent>,
    private _translateService: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
    this.attachmentCopy = {...this.data.attachment} as TaskAttachmentCopy;

    if (!this.attachmentCopy.type) {
      this.attachmentCopy.type = 'LINK';
    }
    this.types = [
      {type: 'LINK', title: T.F.ATTACHMENT.DIALOG_EDIT.TYPES.LINK},
      {type: 'IMG', title: T.F.ATTACHMENT.DIALOG_EDIT.TYPES.IMG},
    ];
    if (IS_ELECTRON) {
      this.types.push({type: 'FILE', title: T.F.ATTACHMENT.DIALOG_EDIT.TYPES.FILE});
    }
  }

  close(attachment?) {
    this._matDialogRef.close(attachment);
  }

  submit() {
    // don't submit invalid data
    if (!this.attachmentCopy.path || !this.attachmentCopy.type) {
      return;
    }

    if (this.attachmentCopy.type === 'LINK' && this.attachmentCopy.path && !this.attachmentCopy.path.match(/(https?|ftp|file):\/\//)) {
      this.attachmentCopy.path = 'http://' + this.attachmentCopy.path;
    }

    this.close(this.attachmentCopy);
  }

  mapTypeToLabel(type: TaskAttachmentType): string {
    switch (type) {
      case 'FILE':
        return T.F.ATTACHMENT.DIALOG_EDIT.LABELS.LINK;
      case 'IMG':
        return T.F.ATTACHMENT.DIALOG_EDIT.LABELS.IMG;
      case 'LINK':
      default:
        return T.F.ATTACHMENT.DIALOG_EDIT.LABELS.LINK;
    }
  }
}