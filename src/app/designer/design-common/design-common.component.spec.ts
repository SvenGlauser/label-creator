import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignCommonComponent } from './design-common.component';

describe('DesignCommonComponent', () => {
  let component: DesignCommonComponent;
  let fixture: ComponentFixture<DesignCommonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignCommonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DesignCommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
