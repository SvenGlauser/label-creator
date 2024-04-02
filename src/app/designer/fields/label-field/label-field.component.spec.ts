import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LabelFieldComponent} from './label-field.component';

describe('DesignLabelComponent', () => {
  let component: LabelFieldComponent;
  let fixture: ComponentFixture<LabelFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabelFieldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabelFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
