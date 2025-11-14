import {Component, Input} from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import {catchError, finalize} from 'rxjs/operators';
import {AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validator} from '@angular/forms';
import {noop, of} from 'rxjs';
import {onFileupload} from "../../../server/file-upload.route";


@Component({
    selector: 'file-upload',
    templateUrl: "file-upload.component.html",
    styleUrls: ["file-upload.component.scss"],
    standalone: false
})
export class FileUploadComponent implements ControlValueAccessor {

  @Input()
  requiredFileType: string;

  fileName: string = '';

  fileUploadError = false;
  uploadProgress: number;

  onChange = (filename: string) => {}
  onTouched = () => {}
  disabled: boolean = false;

  constructor(private http: HttpClient) {

  }

  writeValue(value: any): void {
      this.fileName = value;
  }
  registerOnChange(fn: any): void {
      this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
      this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
      this.disabled = isDisabled;
  }

  onClick(fileUpload: HTMLInputElement): void {
    this.onTouched();
    fileUpload.click();
  }

  onFileSelected(event) {
    const file: File = event.target.files[0];
    if(file) {
      this.fileName = file.name;
      console.log(this.fileName);

      const formData = new FormData();

      formData.append('thumbnail', file);

      this.fileUploadError = false;

      this.http.post("/api/thumbnail-upload", formData, {
        reportProgress: true,
        observe: 'events'
      })
        .pipe(
          catchError(error => {
            this.fileUploadError = true;
            return of(error);
          }),
          finalize(() => {
            this.uploadProgress = null;
          })
        )
        .subscribe(event => {
          if (event.type == HttpEventType.UploadProgress) {
            this.uploadProgress = Math.round(100 * (event.loaded / event.total));
          }
          else if (event.type == HttpEventType.Response) {
            this.onChange(this.fileName);
          }
        })
    }
  }
}
