import { Routes } from '@angular/router';
import { VoiceAssistComponent } from '../voice-assist/voice-assist.component';

export const routes: Routes = [

    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {path:'home',component:VoiceAssistComponent}
];
