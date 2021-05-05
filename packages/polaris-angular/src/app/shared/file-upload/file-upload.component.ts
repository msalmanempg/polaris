import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-file-upload",
  templateUrl: "./file-upload.component.html",
  styleUrls: ["./file-upload.component.scss"],
})
export class FileUploadComponent implements OnInit {
  @Output() uploadFile = new EventEmitter<FileList>();
  @Output() cancelFile = new EventEmitter();

  @Input() label: string;
  @Input() value: string;
  @Input() allowedTypes: string;

  constructor() {}

  ngOnInit(): void {}

  onFileChange(event: Event): void {
    const target = event.target as HTMLInputElement;

    this.value = target.files[0].name;

    this.uploadFile.emit(target.files);

    target.value = null;
  }

  onCancelClick(): void {
    this.value = "";
    this.cancelFile.emit();
  }
}
