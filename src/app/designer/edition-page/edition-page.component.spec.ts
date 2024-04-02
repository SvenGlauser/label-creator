import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionPageComponent } from './edition-page.component';

describe('EditionPageComponent', () => {
  let component: EditionPageComponent;
  let fixture: ComponentFixture<EditionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditionPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
