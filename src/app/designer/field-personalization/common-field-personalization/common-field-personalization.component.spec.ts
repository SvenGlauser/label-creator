import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CommonFieldPersonalizationComponent} from './common-field-personalization.component';

describe('DesignPersonalizationComponent', () => {
  let component: CommonFieldPersonalizationComponent;
  let fixture: ComponentFixture<CommonFieldPersonalizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonFieldPersonalizationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonFieldPersonalizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
