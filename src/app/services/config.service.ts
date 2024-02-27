import { Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AsyncSubject, ReplaySubject, Subject, firstValueFrom, of } from "rxjs";
import { IDMConfiguration } from "../models";
import { ApiService, WebApi } from "./api.service";

interface CoreConfig {
  CdnUrl: string
  GlobalizationCacheKey: string
  Language: string
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private _coreConfig?: CoreConfig
  private _coreConfig$?: AsyncSubject<CoreConfig>

  private _idmConfiguration?: IDMConfiguration
  private _idmConfiguration$?: AsyncSubject<IDMConfiguration>

  constructor(
    private apiService: ApiService
  ) {}

  private _getCoreConfig() {
    /*const qParams = new URLSearchParams(window.location.search)
    let config: BaseConfig = {
      cdnUrl: qParams.get("cdnUrl") ?? "",
      language: qParams.get("language") ?? "",
      globalizationCacheKey: qParams.get("globalizationCacheKey") ?? ""
    }*/
    if (this._coreConfig) return of(this._coreConfig)
    if (!this._coreConfig$) {
      this._coreConfig$ = new AsyncSubject<CoreConfig>();
      (async() => {
        this._coreConfig = await this.apiService.get<CoreConfig>(WebApi.NFC, "configuration")
        this._coreConfig$?.next(this._coreConfig)
        this._coreConfig$?.complete()
        delete this._coreConfig$
      })()
    }
    return this._coreConfig$
  }

  async getCdnUrl() {
    const c = await firstValueFrom(this._getCoreConfig())
    return c.CdnUrl
  }

  private _getIdmConfiguration() {
    if (this._idmConfiguration) return of(this._idmConfiguration)
    if (!this._idmConfiguration$) {
      this._idmConfiguration$ = new AsyncSubject<IDMConfiguration>();
      (async() => {
        this._idmConfiguration = await this.apiService.get<IDMConfiguration>(WebApi.IDM, "Configuration")
        this._idmConfiguration$?.next(this._idmConfiguration)
        this._idmConfiguration$?.complete()
        delete this._idmConfiguration$
      })()
    }
    return this._idmConfiguration$
  }

  getIdmConfiguration() {
    return firstValueFrom(this._getIdmConfiguration())
  }

  async getTheme() {
    const c = await this.getIdmConfiguration()
    return c.CustomThemeConfiguration
  }
}