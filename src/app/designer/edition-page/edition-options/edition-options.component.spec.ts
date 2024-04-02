import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EditionOptionsComponent} from './edition-options.component';

describe('EditionOptionsComponent', () => {
  let component: EditionOptionsComponent;
  let fixture: ComponentFixture<EditionOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditionOptionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditionOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
