import { Directive, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';

@Directive({
  selector: '[appWaitCursor]'
})
export class WaitCursorDirective implements OnDestroy, OnInit {
  constructor(private elementRef: ElementRef<HTMLButtonElement>) {}
  private buttonElement = this.elementRef.nativeElement;

  @HostListener('click') changeCursor(): void {
    this.buttonElement.style.cursor = 'wait';
    document.body.style.cursor = 'wait';
  }

  private observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      const target = mutation.target as HTMLElement;
      if(mutation.attributeName == 'disabled') {
        if (this.buttonElement.disabled)
          this.buttonElement.style.cursor = 'not-allowed';
        else
          this.buttonElement.style.cursor = 'pointer';
      }
      else if (mutation.oldValue == 'cursor: wait;')
        this.buttonElement.style.cursor = 'pointer';
    });
  });

  ngOnInit(): void {
    this.observer.observe(this.buttonElement, { attributeFilter: ['disabled'] });
    this.observer.observe(document.body, { attributeFilter: ['style'], attributeOldValue: true });
  }

  ngOnDestroy(): void { this.observer.disconnect();
    document.body.style.cursor = 'auto';
  }
}
