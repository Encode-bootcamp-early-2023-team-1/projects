import { TestBed } from '@angular/core/testing';

import { EtherService } from './ether.service';

describe('EtherService', () => {
  let service: EtherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EtherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
