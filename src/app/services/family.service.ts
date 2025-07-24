import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FamilyService {

  constructor(
    private http: HttpClient,
    
) { }

public getTree(url, data): Observable<any> {
  return this.http.post(environment.baseUrl + `/report/${url}`, data);
}
public getTreeById(id): Observable<any> {
  return this.http.post(environment.baseUrl + `/allTreedata`, id);
  // return this.http.post('http://192.168.29.141:4005/allTreedata', id);
}
public getTreeList(super_admin_id): Observable<any> {
  return this.http.get(environment.baseUrl + `/getAllFamilyMembers/${super_admin_id}`);
  // return this.http.get('http://192.168.29.141:4005/getAllFamilyMembers');
 
};
// public createTree(data): Observable<any> {
//   return this.http.post(environment.baseUrl + `/addMainTree`, data);
// };
public createTree(data): Observable<any> {
  return this.http.post(environment.baseUrl + `/createaddMainTree`, data);

};

public createCloneTree(data): Observable<any> {
  return this.http.post(environment.baseUrl + `/allTreedata_new`, data);
  // return this.http.post('http://192.168.29.141:4005/allTreedata_new', data);
};

public createChildTree(data): Observable<any> {
  return this.http.post(environment.baseUrl + `/addChildInTree`, data);
};
public updateChildTree(data): Observable<any> {
  return this.http.post(environment.baseUrl + `/UpdateChildInTree`, data);
};
public deleteSampleTree(data): Observable<any> {
  return this.http.post(environment.baseUrl + `/deleteFamilyMember`, data);
};
public deleteChildTree(data): Observable<any> {
  return this.http.post(environment.baseUrl + `/deleteNode`, data);
  // return this.http.post('http://192.168.29.141:4005/deleteNode', data);
};
}
