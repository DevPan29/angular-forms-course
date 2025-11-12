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
export class FileUploadComponent {

  @Input()
  requiredFileType: string;

  fileName: string = '';

  fileUploadError = false;

  constructor(private http: HttpClient) {

  }

  onFileSelected(event) {
    const file: File = event.target.files[0];
    if(file) {
      this.fileName = file.name;
      console.log(this.fileName);

      const formData = new FormData();

      formData.append('thumbnail', file);

      this.fileUploadError = false;

      this.http.post("/api/thumbnail-upload", formData)
        .pipe(
          catchError(error => {
            this.fileUploadError = true;
            return of(error);
          })
        )
        .subscribe()
    }
  }
}
