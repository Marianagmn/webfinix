import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { of } from 'rxjs';
import { CategoryEdit } from './category-edit';

describe('CategoryEdit', () => {
  let component: CategoryEdit;
  let fixture: ComponentFixture<CategoryEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryEdit, RouterTestingModule, HttpClientTestingModule, ToastrModule.forRoot()],
      providers: [
        { provide: Router, useValue: { navigate: () => Promise.resolve(true), navigateByUrl: () => Promise.resolve(true), url: '/categories', events: of([]) } },
        { provide: ActivatedRoute, useValue: { snapshot: { params: {}, queryParams: {}, paramMap: { get: () => null } }, paramMap: { get: () => null } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

