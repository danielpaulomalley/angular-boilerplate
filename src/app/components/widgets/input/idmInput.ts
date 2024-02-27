import { Directive, ElementRef, HostBinding, HostListener } from "@angular/core";
import { Subject } from "rxjs";

@Directive({
  selector: 'input[idmInput]'
})
export class IDMInputDirective {
  private _hasValueSource = new Subject<boolean>()
  hasValue$ = this._hasValueSource.asObservable()
  @HostBinding('class') _elementClass: string = ''

  @HostListener("input") onChange() {
    this._hasValueSource.next(!!this.el.nativeElement.value)
  }
  constructor(
    private el: ElementRef
  ) {}

  ngOnInit() {
    const classes: string[] = [
      'idm-input'
    ]
    this._elementClass = classes.join(' ')
  }

  ngOnChanges() {
    console.log(123)
  }
}