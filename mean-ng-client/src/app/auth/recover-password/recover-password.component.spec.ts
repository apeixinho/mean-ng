import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterTestingModule } from '@angular/router/testing';

import { FormErrorComponent } from '../form-error/form-error.component';
import { FormMessageComponent } from '../form-message/form-message.component';
import { RecoverPasswordComponent } from './recover-password.component';

import { FormValidatorsService } from '../../services/form-validators.service';
import { AuthService } from '../../services/auth.service';

describe('RecoverPasswordComponent', () => {
  let component: RecoverPasswordComponent;
  let fixture: ComponentFixture<RecoverPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RecoverPasswordComponent, FormErrorComponent, FormMessageComponent],
      imports: [HttpModule, ReactiveFormsModule, RouterTestingModule],
      providers: [FormValidatorsService, AuthService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecoverPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
