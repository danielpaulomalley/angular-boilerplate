import { ChangeDetectorRef, OnDestroy, Pipe, PipeTransform } from "@angular/core";
import { Subscription } from "rxjs";
import { GlobalizationService } from "./services/globalization.service";

@Pipe({
  name: 'translate',
  pure: false
})
export class GlobalizationPipe implements OnDestroy, PipeTransform {
  private _key?: string
  private _ref: ChangeDetectorRef|null;
  private _latestValue?: string;
  private _subscription?: Subscription

  constructor(
    ref: ChangeDetectorRef,
    private globService: GlobalizationService
  ) {
    // Assign `ref` into `this._ref` manually instead of declaring `_ref` in the constructor
    // parameter list, as the type of `this._ref` includes `null` unlike the type of `ref`.
    this._ref = ref;
  }

  transform(v: string | undefined, getLangLocale = false): string | undefined {
    if (!v) return ""
    const k = v + getLangLocale
    if (!this._key) {
      this._getTranslation(v, getLangLocale)
      return this._latestValue
    }
    if (k != this._key) {
      this._dispose()
      return this.transform(v, getLangLocale)
    }
    return this._latestValue
  }

  private _getTranslation(key: string, getLangLocale: boolean) {
    const k = key + getLangLocale
    this._key = k
    const obs = getLangLocale ? this.globService.getLanguageLocale(key) : this.globService.getTranslation(key)
    this._subscription = obs.subscribe(res => {
      this._updateLatestValue(k, res)
    })
  }



  private _dispose(): void {
    // Note: `dispose` is only called if a subscription has been initialized before, indicating
    // that `this._strategy` is also available.
    delete this._latestValue
    this._subscription?.unsubscribe()
    delete this._subscription
    delete this._key
  }

  private _updateLatestValue(key: string, value: string): void {
    if (key === this._key) {
      this._latestValue = value;
      // Note: `this._ref` is only cleared in `ngOnDestroy` so is known to be available when a
      // value is being updated.
      this._ref!.markForCheck();
    }
  }

  ngOnDestroy() {
    if (this._subscription) {
      this._dispose();
    }
    // Clear the `ChangeDetectorRef` and its association with the view data, to mitigate
    // potential memory leaks in Observables that could otherwise cause the view data to
    // be retained.
    // https://github.com/angular/angular/issues/17624
    this._ref = null;
  }
}