import {
  Directive, HostListener, HostBinding, Output, EventEmitter,
} from '@angular/core';

@Directive({
  selector: '[appDropzone]',
})

export class DropzoneDirective {
  @Output() filesChange: EventEmitter<FileList> = new EventEmitter();

  @HostBinding('class.dropzone-idle') idleState = true;

  @HostBinding('class.dropzone-active') activeState = false;

  @HostListener('dragover', ['$event'])
  public onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.idleState = false;
    this.activeState = true;
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.idleState = true;
    this.activeState = false;
  }

  @HostListener('drop', ['$event'])
  public onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.idleState = true;
    this.activeState = false;
    if (!event.dataTransfer) return;
    const { files } = event.dataTransfer;
    this.filesChange.emit(files);
  }
}
