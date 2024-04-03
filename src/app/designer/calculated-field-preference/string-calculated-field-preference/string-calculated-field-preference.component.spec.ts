import {ComponentFixture, TestBed} from '@angular/core/testing';

import {StringCalculatedFieldPreferenceComponent} from './string-calculated-field-preference.component';

describe('StringCalculatedFieldPreferenceComponent', () => {
  let component: StringCalculatedFieldPreferenceComponent;
  let fixture: ComponentFixture<StringCalculatedFieldPreferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StringCalculatedFieldPreferenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StringCalculatedFieldPreferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
