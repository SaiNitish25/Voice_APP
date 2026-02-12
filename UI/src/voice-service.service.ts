import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VoiceServiceService {

  private apiUrl = 'http://localhost:5000/submit_transcript';

  constructor(private http: HttpClient) { }

  submitTranscript(data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(this.apiUrl, data, {
      headers: headers,
      withCredentials: true   
    });
  }
}
