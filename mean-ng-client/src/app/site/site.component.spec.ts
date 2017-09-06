import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterTestingModule } from '@angular/router/testing';

import { SiteComponent } from './site.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MessageComponent } from '../messages/message/message.component';
import { MessagesComponent } from '../messages/messages.component';
import { MessageInputComponent } from '../messages/message-input/message-input.component';

import { AuthService } from '../services/auth.service';
import { MessagesService } from '../services/messages.service';
import { CommService } from '../services/comm.service';

describe('SiteComponent', () => {
  let component: SiteComponent;
  let fixture: ComponentFixture<SiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SiteComponent, HeaderComponent, FooterComponent, MessageComponent, MessagesComponent, MessageInputComponent],
      imports: [FormsModule, HttpModule, RouterTestingModule],
      providers: [AuthService, MessagesService, CommService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
