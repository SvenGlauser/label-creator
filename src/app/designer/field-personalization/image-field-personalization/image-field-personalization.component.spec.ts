import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ImageFieldPersonalizationComponent} from './image-field-personalization.component';

describe('DesignImagePersonalizationComponent', () => {
  let component: ImageFieldPersonalizationComponent;
  let fixture: ComponentFixture<ImageFieldPersonalizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageFieldPersonalizationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageFieldPersonalizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
