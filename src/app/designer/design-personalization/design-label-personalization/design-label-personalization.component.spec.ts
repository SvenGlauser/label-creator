import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DesignLabelPersonalizationComponent} from './design-label-personalization.component';

describe('DesignLabelPersonalizationComponent', () => {
  let component: DesignLabelPersonalizationComponent;
  let fixture: ComponentFixture<DesignLabelPersonalizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignLabelPersonalizationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesignLabelPersonalizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
