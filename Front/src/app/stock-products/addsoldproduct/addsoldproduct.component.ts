import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-addsoldproduct',
  templateUrl: './addsoldproduct.component.html',
  styleUrl: './addsoldproduct.component.scss'
})
export class AddsoldproductComponent {
  constructor(public dialogRef: MatDialogRef<AddsoldproductComponent>) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onOk(): void {
    this.dialogRef.close(true);
  }

}
