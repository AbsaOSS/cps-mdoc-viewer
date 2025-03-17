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

import { Component, ContentChild, TemplateRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'cps-mdoc-viewer',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, NgTemplateOutlet],
  templateUrl: 'cps-mdoc-viewer.component.html'
})
export class CpsMdocViewerComponent {
  @ContentChild('footer', { static: false })
  public footerContent?: TemplateRef<unknown>;
}
