import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoiceAssistComponent } from './voice-assist.component';

describe('VoiceAssistComponent', () => {
  let component: VoiceAssistComponent;
  let fixture: ComponentFixture<VoiceAssistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoiceAssistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoiceAssistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
