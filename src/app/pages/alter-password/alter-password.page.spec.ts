import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlterPasswordPage } from './alter-password.page';

describe('AlterPasswordPage', () => {
  let component: AlterPasswordPage;
  let fixture: ComponentFixture<AlterPasswordPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AlterPasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
