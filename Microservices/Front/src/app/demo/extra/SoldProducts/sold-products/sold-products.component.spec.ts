import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoldProductsComponent } from './sold-products.component';

describe('SoldProductsComponent', () => {
  let component: SoldProductsComponent;
  let fixture: ComponentFixture<SoldProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoldProductsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SoldProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
