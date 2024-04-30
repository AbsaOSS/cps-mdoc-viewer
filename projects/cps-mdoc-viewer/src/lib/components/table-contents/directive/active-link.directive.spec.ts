import { Component } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';
import { ActiveLinkDirective } from './active-link.directive';
import { By } from '@angular/platform-browser';

@Component({
  standalone: true,
  template: `
    <div class="navbar">navbar</div>
    <div [appActiveLink]="itemLinks">
      <ul class="list-unstyled">
        <li><a href="#section1">Section 1</a></li>
        <li><a href="#section2">Section 2</a></li>
      </ul>
    </div>
    <div id="section1" style="height: 500px;">Section one</div>
    <div id="section2" style="height: 500px;">Section two</div>
  `,
  imports: [ActiveLinkDirective]
})
class TestComponent {
  itemLinks = [
    { title: 'Section 1', id: 'section1', class: '' },
    { title: 'Section 2', id: 'section2', class: '' }
  ];
}

describe('ActiveLinkDirective', () => {
  globalThis.CSS = {
    escape: jest.fn().mockImplementation((val) => val)
  } as any;
  globalThis.window.scrollTo = jest.fn();

  let fixture: ComponentFixture<TestComponent>;
  let testComponent: TestComponent;
  let directive: ActiveLinkDirective;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      imports: [ActiveLinkDirective, TestComponent],
      providers: []
    }).createComponent(TestComponent);
    fixture.detectChanges();
    testComponent = fixture.componentInstance;
    directive = fixture.debugElement
      .query(By.directive(ActiveLinkDirective))
      .injector.get(ActiveLinkDirective);
  });

  it('should create instance of a TestComponent', () => {
    expect(testComponent).toBeTruthy();
  });

  it('should properly set up click event handlers', fakeAsync(() => {
    directive.appActiveLink = testComponent.itemLinks;
    const spy = jest.spyOn(directive, 'handleItemClick');
    tick();
    fixture.detectChanges();
    const section1Link: HTMLAnchorElement = fixture.nativeElement.querySelector(
      'a[href="#section1"]'
    );
    section1Link.click();
    expect(spy).toHaveBeenCalled();
    expect(globalThis.window.scrollTo).toHaveBeenCalledWith({
      behavior: 'smooth',
      top: 0
    });
  }));
});
