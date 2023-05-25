import { Component, ElementRef, ViewChild } from '@angular/core';
import { catchError, take, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { ClipboardService } from 'ngx-clipboard';


import { ChatGptService } from '../chat-gpt.service';
import { Message } from '../models/message.model';
import { ErrorResponse } from '../models/chat-response.model';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent  {
  userMessage = '';
  conversation: Message[] = [];
  menuOpen: boolean = false;
  logOpen: boolean = false;

  model: string = 'gpt-3.5-turbo';
  communicator = new Audio("../assets/communicator.mp3");

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  constructor(private chatGptService: ChatGptService, private clipboardService: ClipboardService) {}

  sendMessage(event: Event, message: string): void {
    event.preventDefault();
    if (!message.trim()) return;

    this.conversation.push({ role: 'user', content: message });
    this.scrollToBottom();
    this.userMessage = '';

    this.chatGptService
      .chat(this.conversation)
      .pipe(
        take(1),
        tap(response => {
          const assistantMessage = response.choices[0].message.content;
          this.conversation.push({ role: 'assistant', content: assistantMessage });
        }),
        catchError((error) => this.handleError(error))
      )
      .subscribe();
  }

  handleEnterKey(event: Event): void {
    event.preventDefault();
    this.sendMessage(event, this.userMessage);
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    setTimeout(() => {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    }, 0);
  }
  
  copyMessage(message: string) {
    this.clipboardService.copyFromContent(message)
  }
  copyConversation() {
    let chatArrayToMessages = this.conversation.map(message => message.role +': '+ message.content);
    let chatToString = chatArrayToMessages.join("\n");
    this.clipboardService.copyFromContent(chatToString)
  }
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    if(this.menuOpen === true) {
      this.communicator.play();
    }
  }
  toggleChangelog() {
    this.logOpen = !this.logOpen;
  }
  selectModel(model: string) {
    this.model = model;
    console.log("model", model);
  }
  
  private handleError(error: ErrorResponse): Observable<unknown> {
    if (error.error && error.error.message) {
      let errorMessage = `Error: ${error.error.message}`;
      if (error.error.type) {
        errorMessage += ` (Type: ${error.error.type})`;
      }
      this.conversation.push({ role: 'error', content: errorMessage });
    } else {
      this.conversation.push({ role: 'error', content: 'An unknown error occurred.' });
    }
    this.scrollToBottom();
    return of(null);
  }
}