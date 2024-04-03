import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculatedFieldsPreferencesComponent } from './calculated-fields-preferences.component';

describe('CalculatedFieldsPreferencesComponent', () => {
  let component: CalculatedFieldsPreferencesComponent;
  let fixture: ComponentFixture<CalculatedFieldsPreferencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalculatedFieldsPreferencesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CalculatedFieldsPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
