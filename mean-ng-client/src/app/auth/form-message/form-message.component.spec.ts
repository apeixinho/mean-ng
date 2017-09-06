import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { FormMessageComponent } from './form-message.component';

describe('FormMessageComponent', () => {
  let component: FormMessageComponent;
  let fixture: ComponentFixture<FormMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormMessageComponent],
      imports: [FormsModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
