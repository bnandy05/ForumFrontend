import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNewCategoryComponent } from './admin-new-category.component';

describe('AdminNewCategoryComponent', () => {
  let component: AdminNewCategoryComponent;
  let fixture: ComponentFixture<AdminNewCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminNewCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminNewCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
