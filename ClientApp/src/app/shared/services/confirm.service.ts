import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';

@Injectable()
export class ConfirmService {
    constructor(
        private dialog: MatDialog
    ) { }

    dialogRef: MatDialogRef<ConfirmDialogComponent>;

    public open(options): void {
        this.dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
                title: options.title,
                message: options.message,
                cancelText: options.cancelText,
                confirmText: options.confirmText
            }
        });
    }

    public confirmed = (): Observable<any> => this.dialogRef.afterClosed().pipe(take(1), map(res => res));

}