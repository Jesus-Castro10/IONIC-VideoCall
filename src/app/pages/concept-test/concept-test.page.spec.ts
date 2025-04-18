import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConceptTestPage } from './concept-test.page';

describe('ConceptTestPage', () => {
  let component: ConceptTestPage;
  let fixture: ComponentFixture<ConceptTestPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConceptTestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
