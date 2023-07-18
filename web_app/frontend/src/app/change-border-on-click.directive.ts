import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[changeBorderOnClick]'
})
export class ChangeBorderOnClickDirective {
  constructor(private elementRef: ElementRef) {}
  private nativeElement = this.elementRef.nativeElement;

  @Input() defaultBorderStyle = '';
  @Input() mousedownBorderStyle = '';

  @HostListener('mousedown') changeBorderOnMouseDown() {
    this.nativeElement.style.borderStyle = this.mousedownBorderStyle;
  }

  @HostListener('mouseup') changeBorderOnMouseUp() {
    this.nativeElement.style.borderStyle = this.defaultBorderStyle;
  }

  @HostListener('mouseleave') changeBorderOnMouseLeave() {
    this.nativeElement.style.borderStyle = this.defaultBorderStyle;
  }
}
