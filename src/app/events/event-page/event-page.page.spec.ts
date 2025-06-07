import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventPagePage } from './event-page.page';

describe('EventPagePage', () => {
  let component: EventPagePage;
  let fixture: ComponentFixture<EventPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EventPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
