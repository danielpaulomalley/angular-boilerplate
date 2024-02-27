import { Injectable } from "@angular/core";
import { ConfigService } from "./config.service";

@Injectable({ providedIn: 'root'})
export class ThemeService {
  constructor(
    private configService: ConfigService
  ) {}

  async init() {
    const theme = await this.configService.getTheme()
    if (!theme) return
    this._setVariable("--amag-theme-color1", theme.FirstColor)
    this._setVariable("--amag-theme-color2", theme.SecondaryColor)
    this._setVariable("--amag-theme-color3", theme.ThirdColor)
  }

  private _setVariable(name: string, property: string) {
    document.documentElement.style.setProperty(name, property)
  }
}