import { TestBed } from '@angular/core/testing';

import { HttpdatabaseService } from './httpdatabase.service';

describe('HttpdatabaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HttpdatabaseService = TestBed.get(HttpdatabaseService);
    expect(service).toBeTruthy();
  });
});
