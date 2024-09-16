import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DatabaseService } from '../database.service';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-rick-tool',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgIf,
    CommonModule,
  ],
  template: `
    <div class="container">
      <h2>Please fill in the available product information</h2>
      <form (ngSubmit)="onSubmit()">
        <div class="file-upload">
          <button mat-raised-button (click)="fileInput.click()">
            Choose File
          </button>
          <input
            hidden
            (change)="onFileSelected($event)"
            #fileInput
            type="file"
            accept=".pdf,.html"
          />
          <span>{{
            selectedFile?.name || 'Your file name will appear here'
          }}</span>
        </div>
        <div class="form-grid">
          <mat-form-field>
            <mat-label>Product Code</mat-label>
            <input
              matInput
              [(ngModel)]="productCode"
              name="productCode"
              required
            />
          </mat-form-field>

          <mat-form-field>
            <mat-label>Folder</mat-label>
            <input matInput [(ngModel)]="folder" name="folder" required />
          </mat-form-field>

          <mat-form-field>
            <mat-label>BDS Code</mat-label>
            <input matInput [(ngModel)]="bdsCode" name="bdsCode" required />
          </mat-form-field>

          <mat-form-field>
            <mat-label>Race Date</mat-label>
            <input
              matInput
              [matDatepicker]="picker"
              [(ngModel)]="raceDate"
              name="raceDate"
              required
            />
            <mat-datepicker-toggle
              matSuffix
              [for]="picker"
            ></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>

          <mat-form-field>
            <mat-label>Race Number</mat-label>
            <input
              matInput
              type="number"
              [(ngModel)]="raceNumber"
              name="raceNumber"
              required
            />
          </mat-form-field>

          <mat-form-field>
            <mat-label>Day/Evening</mat-label>
            <mat-select [(ngModel)]="dayEvening" name="dayEvening" required>
              <mat-option value="D">Day</mat-option>
              <mat-option value="E">Evening</mat-option>
            </mat-select>
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
            <mat-select [(ngModel)]="trackType" name="trackType" required>
              <mat-option value="TB">Thoroughbred</mat-option>
              <mat-option value="G">Greyhound</mat-option>
              <mat-option value="H">Harness</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <button
          mat-raised-button
          color="primary"
          type="submit"
          [disabled]="!isFormValid()"
        >
          Commit
        </button>
      </form>
    </div>
  `,
  styles: [
    `
      .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
      }
      .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
      }
      .file-upload {
        margin: 20px 0;
      }
      .file-upload span {
        margin-left: 10px;
      }
      button[type='submit'] {
        width: 100%;
      }
    `,
  ],
})
export class RickToolComponent {
  productCode = '';
  folder = '';
  bdsCode = '';
  raceDate: Date | null = null;
  raceNumber = 0;
  dayEvening = '';
  country = 'USA';
  stage = 'F';
  trackType = '';
  selectedFile: File | null = null;

  constructor(private databaseService: DatabaseService) {}

  onFileSelected(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList && fileList.length > 0) {
      this.selectedFile = fileList[0];
    } else {
      this.selectedFile = null;
    }
  }

  isFormValid(): boolean {
    return (
      !!this.productCode &&
      !!this.folder &&
      !!this.bdsCode &&
      !!this.raceDate &&
      !!this.dayEvening &&
      !!this.trackType &&
      !!this.selectedFile
    );
  }

  onSubmit() {
    if (!this.isFormValid()) {
      console.error('Form is not valid');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile as File);
    formData.append('productCode', this.productCode);
    formData.append('folder', this.folder.toLowerCase());
    formData.append('bdsCode', this.bdsCode);
    formData.append(
      'raceDate',
      this.raceDate ? this.raceDate.toISOString() : ''
    );
    formData.append('raceNumber', this.raceNumber.toString());
    formData.append('dayEvening', this.dayEvening);
    formData.append('country', this.country);
    formData.append('stage', this.stage);
    formData.append('trackType', this.trackType);

    this.databaseService.insertRecord(formData).subscribe(
      (response) => {
        console.log('Record inserted successfully:', response);
        // Add any success handling here (e.g., show a success message)
      },
      (error) => {
        console.error('Error inserting record:', error);
        // Add any error handling here (e.g., show an error message)
      }
    );
  }
}
