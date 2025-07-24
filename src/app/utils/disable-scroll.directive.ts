import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appDisableScroll]'
})
export class DisableScrollDirective {
  constructor(private el: ElementRef) {}

  @HostListener('document:scroll', ['$event'])
  onScroll(event: Event): void {
    // console.log(event);
      const dropdown = document.querySelector('.p-dropdown-panel');
      if (dropdown) {
        // console.log("dr");
          event.stopImmediatePropagation();
      }
  }

}
