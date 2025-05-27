import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestChatPage } from './test-chat.page';

describe('TestChatPage', () => {
  let component: TestChatPage;
  let fixture: ComponentFixture<TestChatPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TestChatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
