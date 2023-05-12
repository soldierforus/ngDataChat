import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ChatResponse } from './models/chat-response.model';

@Injectable({
  providedIn: 'root'
})
export class ChatGptService {
  private apiUrl = 'https://api.openai.com/v1/chat/completions';

  constructor(private http: HttpClient) {}

  chat(messages:  Array<{ role: string; content: string }>): Observable<ChatResponse> {
    console.log("messages", messages);
    const body = {
      model: 'gpt-3.5-turbo',
      messages: messages,
      temperature: 0.5,
    };
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${environment.chatGptApiKey}`
    };
    console.log("body", body);
    return this.http.post<ChatResponse>(this.apiUrl, body, { headers });
  }
}
