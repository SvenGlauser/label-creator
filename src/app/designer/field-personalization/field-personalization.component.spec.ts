import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FieldPersonalizationComponent} from './field-personalization.component';

describe('DesignPersonalizationComponent', () => {
  let component: FieldPersonalizationComponent;
  let fixture: ComponentFixture<FieldPersonalizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldPersonalizationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FieldPersonalizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
