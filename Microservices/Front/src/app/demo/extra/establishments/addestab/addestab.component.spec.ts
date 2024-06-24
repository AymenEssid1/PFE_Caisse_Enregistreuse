import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddestabComponent } from './addestab.component';

describe('AddestabComponent', () => {
  let component: AddestabComponent;
  let fixture: ComponentFixture<AddestabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddestabComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddestabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
