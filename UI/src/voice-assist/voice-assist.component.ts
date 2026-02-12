import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VoiceServiceService } from '../voice-service.service';
import { isScheduler } from 'rxjs/internal/util/isScheduler';

@Component({
  selector: 'app-voice-assist',
  imports: [FormsModule,CommonModule],
  templateUrl: './voice-assist.component.html',
  styleUrl: './voice-assist.component.css'
})
export class VoiceAssistComponent {
transcript = '';
  isRecording = false;
  isMessageSent=false;
  recognition: any;
  email=''
  scheduledTime='00:00';
  showSchedule = false;
  isemail=false
  isScheduled=false

  constructor(private voiceService:VoiceServiceService) {
  }
    

  checkEmailEntered(){
    this.isemail=true
  }
  startListening() {



   


    const speechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!speechRecognition) {
      alert('Speech Recognition is not supported in this browser.');
      return;
    }
    this.recognition = new speechRecognition();
    this.recognition.continuous = false;
    this.recognition.lang = 'en-US';
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcriptPiece = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          this.transcript += transcriptPiece;
        } else {
          interimTranscript += transcriptPiece;
        }
      }
      // Show interim transcript in the input field
      this.transcript = this.transcript + interimTranscript;
      if (event.results[event.results.length - 1].isFinal) {
        this.isRecording = false;
      }
      console.log('Transcript:', this.transcript);
    };

    this.recognition.onerror = () => {
      this.isRecording = false;
    };
  
     this.isRecording = true;
    console.log('Recording started');
    this.recognition.start();
  }

  stopListening() {
    this.isRecording = false;
    console.log('Recording stopped');
    this.recognition.stop();
  }

  sendTranscript() {
    // TODO: Implement backend API call
    console.log(this.transcript)
    const data={
      "email":this.email,
      "transcript":this.transcript,
      "scheduledTime": ''
    }
    this.voiceService.submitTranscript(data).subscribe({
      next:(response)=>{
        console.log(response);
        this.isMessageSent=true;
      },
      error:(error)=>{
        console.log(error)
      }
    })
  }

  toggleSchedule() { this.showSchedule = !this.showSchedule; } 
  scheduleTranscript() { 
    const payload = { "email":this.email,"transcript": this.transcript, "scheduledTime": this.scheduledTime  }; 
    console.log(payload)
    this.voiceService.submitTranscript(payload) .subscribe({
      next:(response)=>{
        console.log(response)
        this.isScheduled=true
      },
      error:(error)=>{
        console.log(error)
      }
    });
}
}

