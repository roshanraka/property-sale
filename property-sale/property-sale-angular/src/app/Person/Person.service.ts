/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';
import { Person } from '../org.dunyalabs.propertysale';
import { Property } from '../org.dunyalabs.propertysale';
import { SaleProposal } from '../org.dunyalabs.propertysale';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/Rx';

// Can be injected into a constructor
@Injectable()
export class PersonService {

  private NAMESPACE = 'Person';
  private PROPERTYNAMESPACE = 'Property';
  private PROPOSALNAMESPACE = 'SaleProposal';
  private QUOTENAMESPACE = 'Quote';
  
  private resolveSuffix = '?resolve=true';
  private actionUrl: string;
  private headers: Headers;

  constructor(private dataService: DataService<Person>, private http: Http) {
    this.actionUrl = '/api/';
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
  };

  public getAll(): Observable<Person[]> {
    return this.dataService.getAll(this.NAMESPACE);
  }

  public getAllProperty() {
    
    return this.http.get(`${this.actionUrl}${this.PROPERTYNAMESPACE}`)
      .map(this.extractData)
      .catch(this.handleError);
  }

  public getAllProposal() {
    
    return this.http.get(`${this.actionUrl}${this.PROPOSALNAMESPACE}`)
      .map(this.extractData)
      .catch(this.handleError);
  }

  public getAllQuotes() {
    
    return this.http.get(`${this.actionUrl}${this.QUOTENAMESPACE}`)
      .map(this.extractData)
      .catch(this.handleError);
  }

  public getparticipant(id: any): Observable<Person> {
    return this.dataService.getSingle(this.NAMESPACE, id);
  }

  public addParticipant(itemToAdd: any): Observable<Person> {
    return this.dataService.add(this.NAMESPACE, itemToAdd);
  }

  public updateParticipant(id: any, itemToUpdate: any): Observable<Person> {
    return this.dataService.update(this.NAMESPACE, id, itemToUpdate);
  }

  public deleteParticipant(id: any): Observable<Person> {
    return this.dataService.delete(this.NAMESPACE, id);
  }

  private extractData(res: Response): any {
    return res.json();
  }

  private handleError(error: any): Observable<string> {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    const errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
}
}
