import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DateCalculatedFieldPreferenceComponent} from './date-calculated-field-preference.component';

describe('DateCalculatedFieldPreferenceComponent', () => {
  let component: DateCalculatedFieldPreferenceComponent;
  let fixture: ComponentFixture<DateCalculatedFieldPreferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateCalculatedFieldPreferenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DateCalculatedFieldPreferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
