/*
 * Copyright 2024 ABSA Group Limited
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
