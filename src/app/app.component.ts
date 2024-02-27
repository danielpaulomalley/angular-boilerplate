import { Component } from '@angular/core';
import { ConfigService } from './services/config.service';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'NFC Config';

  constructor(
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    this.themeService.init()
  }
}
