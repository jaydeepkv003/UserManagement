import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RootUser } from '@app/_pages/users/user.data';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUser(url: string): Observable<RootUser> {
    return this.http.get<RootUser>(url)
  }

  updateUser(url: string, data: Object){
    return this.http.put(url, data)
  }
}

