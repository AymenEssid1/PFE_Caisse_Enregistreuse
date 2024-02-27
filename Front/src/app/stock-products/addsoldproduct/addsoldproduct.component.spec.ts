import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddsoldproductComponent } from './addsoldproduct.component';

describe('AddsoldproductComponent', () => {
  let component: AddsoldproductComponent;
  let fixture: ComponentFixture<AddsoldproductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddsoldproductComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddsoldproductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
