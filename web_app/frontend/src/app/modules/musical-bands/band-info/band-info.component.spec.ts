import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BandInfoComponent } from './band-info.component';

describe('BandInfoComponent', () => {
  let component: BandInfoComponent;
  let fixture: ComponentFixture<BandInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BandInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BandInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
