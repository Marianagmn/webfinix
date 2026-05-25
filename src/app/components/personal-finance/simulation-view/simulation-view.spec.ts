import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastrModule } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SimulationView } from './simulation-view';

describe('SimulationView', () => {
  let component: SimulationView;
  let fixture: ComponentFixture<SimulationView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({    imports: [SimulationView, RouterTestingModule, HttpClientTestingModule, ToastrModule.forRoot(), RouterTestingModule, HttpClientTestingModule, ToastrModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(SimulationView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
