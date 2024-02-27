import { Directive, HostBinding, Input } from "@angular/core";

@Directive({
  selector: '[amag-button]'
})
export class AMAGButtonDirective {
  private classSelectors = {
    class: '', // set by class="xyz" - ie: <button adt-button class="xyz">
    color: 'accent',
    buttonType: 'basic'
  }

  @Input('class') set class(v: string) {
    this.classSelectors.class = v
  }

  @Input('color') set color(v: string) {
    this.classSelectors.color = v
  }

  @HostBinding('class') _elementClass: string = ''

  ngOnInit() {
    const classes: string[] = [
      'amag-button',
      `amag-button-${this.classSelectors.color}`,
      `amag-${this.classSelectors.buttonType}-button`
    ]
    if (this.classSelectors.class) classes.push(this.classSelectors.class)
    this._elementClass = classes.join(' ')
  }
}