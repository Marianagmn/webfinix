import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastrModule } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PredictionView } from './prediction-view';

describe('PredictionView', () => {
  let component: PredictionView;
  let fixture: ComponentFixture<PredictionView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({    imports: [PredictionView, RouterTestingModule, HttpClientTestingModule, ToastrModule.forRoot(), RouterTestingModule, HttpClientTestingModule, ToastrModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(PredictionView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
