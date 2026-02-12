import { TestBed } from '@angular/core/testing';

import { VoiceServiceService } from './voice-service.service';

describe('VoiceServiceService', () => {
  let service: VoiceServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VoiceServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
