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

export interface Category {
  sortedOrder: (string | MarkdownFile)[];
  // TODO: Improve types
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface MarkdownFile {
  title: string;
  id: string;
  filePath: string;
  file: string;
  weight: number;
  content: string;
  level: number;
  toolbar_title?: string;
  date?: Date;
  // TODO: Improve types
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
