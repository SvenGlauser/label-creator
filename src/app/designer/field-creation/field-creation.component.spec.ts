import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldCreationComponent } from './field-creation.component';

describe('DesignCreationComponent', () => {
  let component: FieldCreationComponent;
  let fixture: ComponentFixture<FieldCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldCreationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FieldCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
