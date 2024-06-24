import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotactiveComponent } from './notactive.component';

describe('NotactiveComponent', () => {
  let component: NotactiveComponent;
  let fixture: ComponentFixture<NotactiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotactiveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NotactiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
