import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DesignLabelComponent} from './design-label.component';

describe('DesignLabelComponent', () => {
  let component: DesignLabelComponent;
  let fixture: ComponentFixture<DesignLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignLabelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesignLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
