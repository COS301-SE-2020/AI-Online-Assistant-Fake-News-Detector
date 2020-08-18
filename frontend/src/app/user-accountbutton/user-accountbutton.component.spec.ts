import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAccountbuttonComponent } from './user-accountbutton.component';

describe('UserAccountbuttonComponent', () => {
  let component: UserAccountbuttonComponent;
  let fixture: ComponentFixture<UserAccountbuttonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAccountbuttonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAccountbuttonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
