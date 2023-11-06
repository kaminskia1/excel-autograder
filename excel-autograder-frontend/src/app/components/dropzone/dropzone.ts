import {
  Directive, HostListener, HostBinding, Output, Input, EventEmitter,
} from '@angular/core';

@Directive({
  selector: '[dropzone]',
})

export class Dropzone {
  @Output() private filesChange : EventEmitter<FileList> = new EventEmitter();

  @HostBinding('style.border') private border = 'none';

  @HostBinding('style.background') private background = 'white';

  @HostListener('dragover', ['$event'])
  public onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.border = '2px solid rgba(0,0,0,.06)';
    this.background = 'rgba(0,0,0,.04)';
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.border = 'none';
    this.background = 'white';
  }

  @HostListener('drop', ['$event'])
  public onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.border = 'none';
    this.background = 'white';
    if (!event.dataTransfer) return;
    const { files } = event.dataTransfer;
    this.filesChange.emit(files);
  }
}
