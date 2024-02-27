import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadStateSource = new Subject<boolean>()

  loadState$ = this.loadStateSource.asObservable()

  show() {
    this.loadStateSource.next(true)
  }

  hide() {
    this.loadStateSource.next(false)
  }
}