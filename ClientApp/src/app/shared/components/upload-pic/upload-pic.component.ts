import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../services';

@Component({
  selector: 'GU-upload-pic',
  templateUrl: './upload-pic.component.html',
  styleUrls: ['./upload-pic.component.scss']
})
export class UploadPicComponent {
  @Input() id: string;
  selectedFiles: any;
  url: any;
  constructor(
    private accountService: AccountService,
    private http: HttpClient
  ) { }

  selectFile(event): void {
    this.selectedFiles = event.target.files;
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (event: any) => {
      this.url = event.target.result;
    }
  }

  addPhoto(): void {
    let fileToUpload = <File>this.selectedFiles[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);

    this.http.post(environment.baseUrl + 'users/add-photo', formData).subscribe(res => {
      console.log(res)
    });
  }

}
