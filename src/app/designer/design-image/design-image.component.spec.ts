import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignImageComponent } from './design-image.component';

describe('DesignImageComponent', () => {
  let component: DesignImageComponent;
  let fixture: ComponentFixture<DesignImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignImageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DesignImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
