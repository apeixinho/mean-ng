import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterTestingModule } from '@angular/router/testing';

import { RegisterComponent } from './register.component';
import { FormErrorComponent } from '../form-error/form-error.component';
import { FormMessageComponent } from '../form-message/form-message.component';

import { FormValidatorsService } from '../../services/form-validators.service';
import { AuthService } from '../../services/auth.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterComponent, FormErrorComponent, FormMessageComponent],
      imports: [HttpModule, ReactiveFormsModule, RouterTestingModule],
      providers: [FormValidatorsService, AuthService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
