import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonCalculatedFieldPreferenceComponent } from './common-calculated-field-preference.component';

describe('CalculatedFieldPreferenceComponent', () => {
  let component: CommonCalculatedFieldPreferenceComponent;
  let fixture: ComponentFixture<CommonCalculatedFieldPreferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonCalculatedFieldPreferenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonCalculatedFieldPreferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
