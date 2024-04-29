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
