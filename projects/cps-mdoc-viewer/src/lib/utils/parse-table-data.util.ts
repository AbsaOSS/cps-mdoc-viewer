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

export interface TableData {
  columns: { field: string; header: string }[];
  data: { [key: string]: string }[];
}

export function parseTableData(table: HTMLTableElement): TableData {
  const columns: { field: string; header: string }[] = Array.from(
    table.tHead?.rows[0].cells ?? []
  ).map((cell) => ({
    field: cell.textContent ?? '',
    header: cell.textContent ?? ''
  }));
  const data: { [key: string]: string }[] = Array.from(
    table.tBodies[0].rows ?? []
  ).map((row) => ({
    ...columns.reduce(
      (acc, column, index) => ({
        ...acc,
        [column.field]: row.cells[index].innerHTML ?? ''
      }),
      {}
    )
  }));
  return { columns, data };
}
