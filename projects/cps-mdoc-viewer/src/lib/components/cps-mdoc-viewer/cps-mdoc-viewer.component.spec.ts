import { NavbarComponent } from './../navbar/navbar.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpsMdocViewerComponent } from './cps-mdoc-viewer.component';
import { FooterComponent } from '../footer/footer.component';
import { Component } from '@angular/core';

@Component({
  selector: 'navbar',
  standalone: true
})
class NavbarMockComponent {}

@Component({
  selector: 'footer-comp',
  standalone: true
})
class FooterMockComponent {}

describe('CpsMdocViewerComponent', () => {
  let component: CpsMdocViewerComponent;
  let fixture: ComponentFixture<CpsMdocViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CpsMdocViewerComponent]
    })
      .overrideComponent(CpsMdocViewerComponent, {
        remove: { imports: [NavbarComponent, FooterComponent] },
        add: { imports: [NavbarMockComponent, FooterMockComponent] }
      })
      .compileComponents();

    fixture = TestBed.createComponent(CpsMdocViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
