import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownCalculatedFieldPreferenceComponent } from './dropdown-calculated-field-preference.component';

describe('DropdownCalculatedFieldPreferenceComponent', () => {
  let component: DropdownCalculatedFieldPreferenceComponent;
  let fixture: ComponentFixture<DropdownCalculatedFieldPreferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownCalculatedFieldPreferenceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DropdownCalculatedFieldPreferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
