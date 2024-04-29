import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpsMdocViewerComponent } from './cps-mdoc-viewer.component';

describe('CpsMdocViewerComponent', () => {
  let component: CpsMdocViewerComponent;
  let fixture: ComponentFixture<CpsMdocViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CpsMdocViewerComponent]
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
