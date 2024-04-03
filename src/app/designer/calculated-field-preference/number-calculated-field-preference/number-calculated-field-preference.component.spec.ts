import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NumberCalculatedFieldPreferenceComponent} from './number-calculated-field-preference.component';

describe('NumberCalculatedFieldPreferenceComponent', () => {
  let component: NumberCalculatedFieldPreferenceComponent;
  let fixture: ComponentFixture<NumberCalculatedFieldPreferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NumberCalculatedFieldPreferenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NumberCalculatedFieldPreferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
