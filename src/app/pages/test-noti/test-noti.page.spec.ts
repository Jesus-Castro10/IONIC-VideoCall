import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestNotiPage } from './test-noti.page';

describe('TestNotiPage', () => {
  let component: TestNotiPage;
  let fixture: ComponentFixture<TestNotiPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TestNotiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
