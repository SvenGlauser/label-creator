import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignCreationComponent } from './design-creation.component';

describe('DesignCreationComponent', () => {
  let component: DesignCreationComponent;
  let fixture: ComponentFixture<DesignCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignCreationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DesignCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
