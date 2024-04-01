import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignImagePersonalizationComponent } from './design-image-personalization.component';

describe('DesignImagePersonalizationComponent', () => {
  let component: DesignImagePersonalizationComponent;
  let fixture: ComponentFixture<DesignImagePersonalizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignImagePersonalizationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DesignImagePersonalizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
