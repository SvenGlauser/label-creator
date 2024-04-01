import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignPersonalizationComponent } from './design-personalization.component';

describe('DesignPersonalizationComponent', () => {
  let component: DesignPersonalizationComponent;
  let fixture: ComponentFixture<DesignPersonalizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignPersonalizationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DesignPersonalizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
