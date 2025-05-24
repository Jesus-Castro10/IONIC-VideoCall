import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestLocationPage } from './test-location.page';

describe('TestLocationPage', () => {
  let component: TestLocationPage;
  let fixture: ComponentFixture<TestLocationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TestLocationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
