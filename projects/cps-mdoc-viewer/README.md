# CPS MDoc Viewer

**[Live demo](https://absaoss.github.io/cps-mdoc-viewer/)**

An Angular library for building documentation and tutorial websites powered by markdown. Drop it into your app, point it at a folder of `.md` files, and it takes care of the rest — navigation, routing, a table of contents, and a clean reading layout out of the box.

### Features

- **Markdown rendering** — built on [ngx-markdown](https://github.com/jfcere/ngx-markdown), with automatic metadata stripping
- **Auto-generated navigation** — a sticky navbar and category-based routing derived from your content structure
- **Table of contents** — per-page, scroll-aware contents sidebar
- **Configurable** — set a title, logo, and markdown file location via a single config object
- **Custom footer** — slot in your own footer template via content projection

### Usage

Register the library in your app config:

```ts
import { provideCPSMDocViewer } from 'cps-mdoc-viewer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideCPSMDocViewer({
      headerTitle: 'My Docs',
      pageTitle: 'My Docs',
      logo: 'assets/logo.svg',
      markdownFilesLocation: 'assets/docs'
    })
  ]
};
```

Then add the component to your template:

```html
<cps-mdoc-viewer>
  <ng-template #footer>Your custom footer here</ng-template>
</cps-mdoc-viewer>
```

### License

Apache License 2.0 (see the [LICENSE](https://github.com/AbsaOSS/cps-mdoc-viewer/blob/master/LICENSE) file for the full text)
