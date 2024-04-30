import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MockComponent } from 'ng-mocks';
import { CpsMdocViewerComponent } from 'cps-mdoc-viewer';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent]
    })
      .overrideComponent(AppComponent, {
        remove: { imports: [CpsMdocViewerComponent] },
        add: { imports: [MockComponent(CpsMdocViewerComponent)] }
      })
      .compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
