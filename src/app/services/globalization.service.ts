import { Injectable } from "@angular/core";
import * as Globalize from "globalize";
import { ReplaySubject, firstValueFrom, Observable, map } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { ConfigService } from "./config.service";

const REQUIRED_SUPPLEMENTAL = ["likelySubtags", "plurals", "timeData", "weekData"];
const REQUIRED_MAIN = ["ca-gregorian", "dateFields", "numbers", "units", "languages"];

const GLOBALIZATION_URI = "/globalization/";
const CLDRDATA_URI = GLOBALIZATION_URI + "cldr-data/";

const MAIN_JSON = CLDRDATA_URI + "main.json";
const MAIN_PATH = CLDRDATA_URI + "main/";

const SUPPLEMENTAL_JSON = CLDRDATA_URI + "supplemental.json";
const SUPPLEMENTAL_PATH = CLDRDATA_URI + "supplemental/";

const TIMEZONE_JSON = CLDRDATA_URI + "iana-tz-data.json";
const LOCALES_JSON = CLDRDATA_URI + "locales.json";

const DEFAULT_MAIN_LOCALE = "en";
const DEFAULT_MESSAGES_LOCALE = "en-US";

const MODULES = ["idm", "cac", "nfc"]


@Injectable({ providedIn: 'root' })
export class GlobalizationService {
  private globalizer?: Globalize

  private locale = "en-US"
  private mainLocale = "en"
  private _mainLocales$?: ReplaySubject<string[]>
  private _supplemental$?: ReplaySubject<object[]>
  private _loaded$ = new ReplaySubject<void>(1)
  constructor(
    private configService: ConfigService
  ) {
    this._init()
  }



  private async _init() {
    const cdnUrl = await this.configService.getCdnUrl()
    const mainLocales = await firstValueFrom(this._getAvailableMainLocales(cdnUrl))
    const sups = await firstValueFrom(this._getSupplemental(cdnUrl))
    if (mainLocales.indexOf(this.locale) != -1) this.mainLocale = this.locale
    else if (this.locale.indexOf("-") != -1) {
      const chk = this.locale.split("-")[0]
      if (mainLocales.indexOf(chk) != -1) this.mainLocale = chk
    }
    const mains = await this._fetchMain(cdnUrl)
    Globalize.load([...sups, ...mains])
    Globalize.locale(this.mainLocale)
    const messages = {} as {[key: string]: object}
    const obj: {[key: string]: object} = {}

    for (const m of MODULES) {
      const msgs = await this._fetchModule(cdnUrl, m)
      obj[m] = msgs
    }
    messages[this.mainLocale] = obj

    Globalize.loadMessages(messages)
    this.globalizer = Globalize(this.mainLocale)
    this._loaded$.next()
  }

  private _getAvailableMainLocales(cdnUrl: string) {
    if (!this._mainLocales$) {
      this._mainLocales$ = new ReplaySubject<string[]>(1);
      (async() => {
        const url = cdnUrl + LOCALES_JSON
        const mains = await this._fetch<string[]>(url)
        this._mainLocales$?.next(mains)
      })()
    }
    return this._mainLocales$
  }

  private _getSupplemental(cdnUrl: string) {
    if (!this._supplemental$) {
      this._supplemental$ = new ReplaySubject<object[]>(1);
      (async () => {
        const url = cdnUrl + SUPPLEMENTAL_JSON
        let sps = await this._fetch<string[]>(url)
        sps = this._pluckValues(sps, REQUIRED_SUPPLEMENTAL)
        let sups = await Promise.all(sps.map(s => this._fetch<object>(cdnUrl + SUPPLEMENTAL_PATH + s)))
        this._supplemental$?.next(sups)
      })()
    }
    return this._supplemental$
  }

  private async _fetchMain(cdnUrl: string) {
    const url = cdnUrl + MAIN_JSON
    let mains = await this._fetch<string[]>(url)
    mains = this._pluckValues(mains, REQUIRED_MAIN)
    return Promise.all(mains.map(m => this._fetch(`${cdnUrl}${MAIN_PATH}${this.mainLocale}/${m}`)))
    //return Promise.all(mains.map(m => this._fetch(`${cdnUrl}${MAIN_PATH}${this.mainLocale}/${m}`)))
  }

  private async _fetchIdm(cdnUrl: string) {
    const url = cdnUrl + `/globalization/idm/ui/${this.locale}.json`
    const messages = await this._fetch<object>(url)
    return messages
  }

  private async _fetchModule(cdnUrl: string, module: string) {
    const url = `${cdnUrl}/globalization/${module}/ui/${this.locale}.json`
    const messages = await this._fetch<object>(url)
    return messages
  }

  private _pluckValues(all: string[], take: string[]) {
    return take.length > 0
      ? all.reduce((acc, crtVal) => {
          if (take.includes(crtVal.split(".")[0]))
            acc.push(crtVal)
          return acc
        }, [] as string[])
      : [...all]
  }

  private async _fetch<T>(url: string): Promise<T>{
    const resp = await fetch(url)
    let json = await resp.json()

    if (typeof json == "string") {
      try {
        // weird issue with capacitor fetch
        json = json.replace(/\\/g, '')
        json = JSON.parse(json)
      } catch(e) {
        console.warn(e)
      }

    }
    return json
  }

  getTranslation(key: string): Observable<string> {
    return this._loaded$.pipe(
      map(() => {
        let retVal = key
        try {
          retVal = this.globalizer?.messageFormatter(key)(({})) ?? key
        } catch (e) {}
        return retVal
      })
    )
  }

  getLanguageLocale(lang: string) {
    return this._loaded$.pipe(
      map(() => {
        let retVal = lang
        const key = `main/${this.mainLocale}/localeDisplayNames/languages/${lang}`
        try {
          retVal = this.globalizer?.cldr.get(key)
        } catch (e) {}
        return retVal
      })
    )
  }
}