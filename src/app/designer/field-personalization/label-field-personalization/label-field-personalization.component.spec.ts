import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LabelFieldPersonalizationComponent} from './label-field-personalization.component';

describe('DesignLabelPersonalizationComponent', () => {
  let component: LabelFieldPersonalizationComponent;
  let fixture: ComponentFixture<LabelFieldPersonalizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabelFieldPersonalizationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabelFieldPersonalizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
