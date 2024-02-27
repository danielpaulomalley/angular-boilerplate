import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

export enum WebApi {
  IDM,
  CAC,
  VMS,
  NFC
}

const WebApiPaths: {[api in WebApi]: string} = {
  [WebApi.IDM]: "G4S.IdentityManagement.WebApi/api",
  [WebApi.CAC]: "AMAG.CAC.WebApi/api",
  [WebApi.VMS]: "",
  [WebApi.NFC]: "Amag.NFC.WebApi/api"
}

@Injectable({providedIn: 'root'})
export class ApiService {
  constructor(
    private http: HttpClient
  ) {}

  getString(api: WebApi, path: string) {
    return new Promise<string>((resolve, reject) => {
      const url = `/${WebApiPaths[api]}/${path}`
      this.http.get(url, {withCredentials: true, responseType: 'text'}).subscribe({
        next: (resp) => resolve(resp),
        error: (e) => {
          reject(e)
        }
      })
    })
  }

  get<T>(api: WebApi, path: string) {
    return new Promise<T>((resolve) => {
      const url = `/${WebApiPaths[api]}/${path}`
      this.http.get<T>(url, {withCredentials: true}).subscribe({
        next: (resp) => resolve(resp),
        error: (e) => console.log(e)
      })
    })
  }

  post<T>(api: WebApi, path: string, body?: any) {
    return new Promise<T>((resolve) => {
      const url = `/${WebApiPaths[api]}/${path}`
      this.http.post<T>(url, body, { withCredentials: true }).subscribe({
        next: (resp) => {
          // keep session alive (this is for testing only)
          resolve(resp)
        },
        error: (e) => {
          console.log("err")
          console.log(e)
        }
      })
    })
  }
}