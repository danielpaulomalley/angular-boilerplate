import { Injectable } from "@angular/core";
import { ApiService, WebApi } from "./api.service";
import { Credential, Employee, Identity } from "../models";

@Injectable({providedIn: 'root'})
export class IdentityService {
  constructor(
    private apiService: ApiService
  ) {}

  async searchIdentities() {
    const payload = {
      PageNumber: 1,
      PageSize: 100,
      SortColumn: "lastName",
      SortType: "Asc"
    }
    const resp = await this.apiService.post<IdentitiesSearchResponse>(WebApi.IDM, "employee/search", payload)
    return resp.Results
  }

  async getLoggedInIdentity() {
    const resp = await this.apiService.get<Identity>(WebApi.CAC, "identities/loggedin")
    return resp
  }

  async getIdentity(id: string) {
    const resp = await this.apiService.get<Employee>(WebApi.IDM, `employee/${id}`)
    return resp
  }

  async getCredentials(id: string) {
    const resp = await this.apiService.get<Credential[]>(WebApi.CAC, `identities/${id}/credentials`)
    return resp
  }
}

interface IdentitiesSearchResponse {
  CurrentCount: number
  PageNumberRequested: number
  PageSizeRequested: number
  Results: Employee[]
  TotalCount: number
}

