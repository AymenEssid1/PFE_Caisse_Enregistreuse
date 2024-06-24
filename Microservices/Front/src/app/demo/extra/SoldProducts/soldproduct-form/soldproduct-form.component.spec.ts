import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoldproductFormComponent } from './soldproduct-form.component';

describe('SoldproductFormComponent', () => {
  let component: SoldproductFormComponent;
  let fixture: ComponentFixture<SoldproductFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoldproductFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SoldproductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
