import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick
} from '@angular/core/testing';

import { NavbarComponent } from './navbar.component';
import { MockProvider } from 'ng-mocks';
import { DirectoryService } from '../../services/directory.service';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DirectoryToolbarInfo } from '../../models/directory-toolbar-info.interface';
import { By } from '@angular/platform-browser';
import { CONFIG_INJECTION_TOKEN } from '../../lib.provider';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let navbarService: DirectoryService;
  const mockTopLevelDirectory: DirectoryToolbarInfo[] = [
    {
      toolbar_title: 'nav',
      directory: 'testing'
    },
    {
      toolbar_title: 'secondNav',
      directory: 'docs'
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        MockProvider(DirectoryService, {
          getTopLevelDirectories: () => of(mockTopLevelDirectory)
        }),
        MockProvider(ActivatedRoute),
        {
          provide: CONFIG_INJECTION_TOKEN,
          useValue: {
            headerTitle: 'Test header title',
            pageTitle: 'Test page title'
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    navbarService = TestBed.inject(DirectoryService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct initial state', () => {
    expect(component.scrollPercent).toBe(0);
  });

  it('should call getTopLevelDirectories on init', () => {
    const spy = jest.spyOn(navbarService, 'getTopLevelDirectories');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should set categories$ and capitalizeFirstLetter correctly from getTopLevelDirectories', (done) => {
    const expectedFirstTitle = 'Nav';
    const expectedSecondTitle = 'SecondNav';
    component.categories$?.subscribe((directories) => {
      expect(directories.length).toBe(2);
      expect(directories[0].toolbar_title).toBe(expectedFirstTitle);
      expect(directories[1].toolbar_title).toBe(expectedSecondTitle);
      done();
    });
  });

  it('should have correct initial state', () => {
    expect(component.scrollPercent).toBe(0);
  });

  it('should correctly update scrollPercent on window scroll', () => {
    // Mock window.scrollY and document.documentElement.scrollTop
    Object.defineProperty(window, 'scrollY', { value: 100 });
    Object.defineProperty(document.documentElement, 'scrollTop', {
      value: 100
    });

    // Mock window.innerHeight and document.documentElement.clientHeight
    Object.defineProperty(window, 'innerHeight', { value: 500 });
    Object.defineProperty(document.documentElement, 'clientHeight', {
      value: 500
    });

    // Mock document heights
    Object.defineProperty(document.body, 'scrollHeight', { value: 1000 });
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 1000
    });
    Object.defineProperty(document.body, 'offsetHeight', { value: 1000 });
    Object.defineProperty(document.documentElement, 'offsetHeight', {
      value: 1000
    });

    component.onWindowScroll();

    // Check that scrollPercent is set correctly
    expect(component.scrollPercent).toBeGreaterThan(0);
  });

  it('should correctly toggle navigation menu', fakeAsync(() => {
    const toggleSpy = jest.spyOn(component, 'toggleNavbarMenu');

    const navbarToggleButton = fixture.debugElement.query(
      By.css('.navbar-toggler')
    );
    const navbarMenu = fixture.debugElement.query(By.css('.navbar-collapse'));
    expect(navbarToggleButton).toBeTruthy();

    // Menu is hidden
    expect(navbarMenu.classes['show']).toBe(undefined);
    expect(navbarMenu.classes['collapse']).toBe(true);

    // Click on the navbar toggle button
    navbarToggleButton?.triggerEventHandler('click');

    // Toggle function was called
    expect(toggleSpy).toHaveBeenCalled();

    // Navbar menu is transitioning
    expect(navbarMenu.classes['collapsing']).toBe(true);
    expect(navbarMenu.classes['collapse']).toBe(undefined);

    tick(351);

    // Navbar menu is visible
    expect(navbarMenu.classes['show']).toBe(true);
    expect(navbarMenu.classes['collapse']).toBe(true);
    expect(navbarMenu.classes['collapsing']).toBe(undefined);

    navbarToggleButton?.triggerEventHandler('click');

    // Navbar menu is transitioning
    expect(navbarMenu.classes['collapsing']).toBe(true);
    expect(navbarMenu.classes['collapse']).toBe(undefined);

    tick(351);

    // Navbar menu is hidden
    expect(navbarMenu.classes['show']).toBe(undefined);
    expect(navbarMenu.classes['collapse']).toBe(true);
    expect(navbarMenu.classes['collapsing']).toBe(undefined);
  }));
});
