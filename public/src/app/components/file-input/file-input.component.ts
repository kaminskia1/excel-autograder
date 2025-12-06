import {
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  Optional,
  Self,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

@Component({
  selector: 'app-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.scss'],
  providers: [
    { provide: MatFormFieldControl, useExisting: FileInputComponent },
  ],
})
export class FileInputComponent implements MatFormFieldControl<File | null>, ControlValueAccessor, OnDestroy {
  static nextId = 0;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  @HostBinding() id = `app-file-input-${FileInputComponent.nextId++}`;

  @Input() accept = '';

  stateChanges = new Subject<void>();

  focused = false;

  touched = false;

  controlType = 'app-file-input';

  isDragOver = false;

  private _placeholder = '';

  private _required = false;

  private _disabled = false;

  private _value: File | null = null;

  // ControlValueAccessor callbacks
  private onChange: (value: File | null) => void = () => {};

  private onTouched: () => void = () => {};

  @Input()
  get placeholder(): string {
    return this._placeholder;
  }

  set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }

  @Input()
  get required(): boolean {
    return this._required;
  }

  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this.stateChanges.next();
  }

  @Input()
  get value(): File | null {
    return this._value;
  }

  set value(file: File | null) {
    this._value = file;
    this.onChange(file);
    this.stateChanges.next();
  }

  get empty(): boolean {
    return !this._value;
  }

  // Always float the label since we always show content
  @HostBinding('class.floating')
  get shouldLabelFloat(): boolean {
    return true;
  }

  // Expose drag state to parent for styling
  @HostBinding('class.drag-over')
  get isDragOverClass(): boolean {
    return this.isDragOver;
  }

  get errorState(): boolean {
    return this.required && this.touched && this.empty;
  }

  // Required by MatFormFieldControl but not used
  @HostBinding('attr.aria-describedby') describedBy = '';

  setDescribedByIds(ids: string[]): void {
    this.describedBy = ids.join(' ');
  }

  constructor(
    private focusMonitor: FocusMonitor,
    private elementRef: ElementRef<HTMLElement>,
    @Optional() @Self() public ngControl: NgControl,
  ) {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }

    this.focusMonitor.monitor(this.elementRef, true).subscribe((origin) => {
      this.focused = !!origin;
      this.stateChanges.next();
    });
  }

  ngOnDestroy(): void {
    this.stateChanges.complete();
    this.focusMonitor.stopMonitoring(this.elementRef);
  }

  onContainerClick(_event: MouseEvent): void {
    if (!this.disabled) {
      this.fileInput.nativeElement.click();
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;
    this.value = file;
    this.touched = true;
    this.onTouched();
  }

  clearFile(event: Event): void {
    event.stopPropagation();
    this.value = null;
    this.fileInput.nativeElement.value = '';
  }

  openFilePicker(): void {
    if (!this.disabled) {
      this.fileInput.nativeElement.click();
    }
  }

  // Drag and drop handlers
  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.disabled) {
      this.isDragOver = true;
    }
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    if (this.disabled) return;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      // Check if file matches accept criteria
      if (this.accept && !this.isFileAccepted(file)) {
        return;
      }
      this.value = file;
      this.touched = true;
      this.onTouched();
    }
  }

  private isFileAccepted(file: File): boolean {
    if (!this.accept) return true;

    const acceptedTypes = this.accept.split(',').map((t) => t.trim().toLowerCase());
    const fileName = file.name.toLowerCase();
    const fileType = file.type.toLowerCase();

    return acceptedTypes.some((type) => {
      if (type.startsWith('.')) {
        // Extension match
        return fileName.endsWith(type);
      }
      // MIME type match
      return fileType === type || (type.endsWith('/*') && fileType.startsWith(type.slice(0, -1)));
    });
  }

  // ControlValueAccessor implementation
  writeValue(file: File | null): void {
    this._value = file;
    this.stateChanges.next();
  }

  registerOnChange(fn: (value: File | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
