import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastrModule } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AnalysisView } from './analysis-view';

describe('AnalysisView', () => {
  let component: AnalysisView;
  let fixture: ComponentFixture<AnalysisView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({    imports: [AnalysisView, RouterTestingModule, HttpClientTestingModule, ToastrModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(AnalysisView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

