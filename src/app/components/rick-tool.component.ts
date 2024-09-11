import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { DatabaseService } from '../database.service';

@Component({
  selector: 'app-rick-tool',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <form (ngSubmit)="onSubmit()">
      <mat-form-field>
        <mat-label>Product Code</mat-label>
        <input matInput [(ngModel)]="productCode" name="productCode" required />
      </mat-form-field>

      <mat-form-field>
        <mat-label>Folder</mat-label>
        <input matInput [(ngModel)]="folder" name="folder" required />
      </mat-form-field>

      <mat-form-field>
        <mat-label>Track ID</mat-label>
        <input matInput [(ngModel)]="trackId" name="trackId" required />
      </mat-form-field>

      <mat-form-field>
        <mat-label>Race Date</mat-label>
        <input matInput [(ngModel)]="raceDate" name="raceDate" required />
      </mat-form-field>

      <mat-form-field>
        <mat-label>Race Number</mat-label>
        <input matInput [(ngModel)]="raceNumber" name="raceNumber" required />
      </mat-form-field>

      <mat-form-field>
        <mat-label>Day/Evening</mat-label>
        <input matInput [(ngModel)]="dayEvening" name="dayEvening" required />
      </mat-form-field>

      <mat-form-field>
        <mat-label>Country</mat-label>
        <input matInput [(ngModel)]="country" name="country" required />
      </mat-form-field>

      <mat-form-field>
        <mat-label>Stage</mat-label>
        <input matInput [(ngModel)]="stage" name="stage" required />
      </mat-form-field>

      <mat-form-field>
        <mat-label>Track Type</mat-label>
        <input matInput [(ngModel)]="trackType" name="trackType" required />
      </mat-form-field>

      <input
        type="file"
        (change)="onFileSelected($event)"
        accept=".pdf"
        required
      />

      <button mat-raised-button color="primary" type="submit">Submit</button>
    </form>
  `,
  styles: [
    `
      form {
        display: flex;
        flex-direction: column;
        max-width: 300px;
        margin: 0 auto;
      }
      mat-form-field {
        margin-bottom: 15px;
      }
    `,
  ],
})
export class RickToolComponent {
  productCode = '';
  folder = '';
  trackId = '';
  raceDate = '';
  raceNumber = '';
  dayEvening = '';
  country = '';
  stage = '';
  trackType = '';
  selectedFile: File | null = null;

  constructor(private databaseService: DatabaseService) {}

  onFileSelected(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      this.selectedFile = fileList[0];
    }
  }

  onSubmit() {
    if (!this.selectedFile) {
      console.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('productCode', this.productCode);
    formData.append('folder', this.folder);
    formData.append('trackId', this.trackId);
    formData.append('raceDate', this.raceDate);
    formData.append('raceNumber', this.raceNumber);
    formData.append('dayEvening', this.dayEvening);
    formData.append('country', this.country);
    formData.append('stage', this.stage);
    formData.append('trackType', this.trackType);

    this.databaseService.insertRecord(formData).subscribe(
      (response) => {
        console.log('Record inserted successfully', response);
        // Handle success (e.g., show a success message)
      },
      (error) => {
        console.error('Error inserting record', error);
        // Handle error (e.g., show an error message)
      }
    );
  }
}
