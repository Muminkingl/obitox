# Fumadocs UI (the default theme of Fumadocs): Docs Page
URL: /docs/ui/layouts/page
Source: https://raw.githubusercontent.com/fuma-nama/fumadocs/refs/heads/main/apps/docs/content/docs/ui/layouts/page.mdx

A page in your documentation
        


<FeedbackBlock
  id="5c89023fb8762b3a"
  body="Page is the base element of a documentation, it includes Table of contents,
Footer, and Breadcrumb."
>
  Page is the base element of a documentation, it includes Table of contents,
  Footer, and Breadcrumb.
</FeedbackBlock>

<Customisation />

Usage [#usage]

<FeedbackBlock id="bdeee646ff88bcb7" body="Import it according to your layout.">
  Import it according to your layout.
</FeedbackBlock>

<CodeBlockTabs defaultValue="Docs Layout">
  <CodeBlockTabsList>
    <CodeBlockTabsTrigger value="Docs Layout">
      Docs Layout
    </CodeBlockTabsTrigger>

    <CodeBlockTabsTrigger value="Notebook Layout">
      Notebook Layout
    </CodeBlockTabsTrigger>
  </CodeBlockTabsList>

  <CodeBlockTab value="Docs Layout">
    ```tsx title="page.tsx" 
    import { DocsPage, DocsDescription, DocsTitle, DocsBody } from 'fumadocs-ui/layouts/docs/page';

    <DocsPage>
      <DocsTitle>title</DocsTitle>
      <DocsDescription>description</DocsDescription>
      <DocsBody>
        <h2>This heading looks good!</h2>
        It applies the Typography styles, wrap your content here.
      </DocsBody>
    </DocsPage>;
    ```
  </CodeBlockTab>

  <CodeBlockTab value="Notebook Layout">
    ```tsx title="page.tsx" 
    import { DocsPage, DocsDescription, DocsTitle, DocsBody } from 'fumadocs-ui/layouts/notebook/page';

    <DocsPage>
      <DocsTitle>title</DocsTitle>
      <DocsDescription>description</DocsDescription>
      <DocsBody>
        <h2>This heading looks good!</h2>
        It applies the Typography styles, wrap your content here.
      </DocsBody>
    </DocsPage>;
    ```
  </CodeBlockTab>
</CodeBlockTabs>

<Callout type="info" title="Good to know">
  Instead of rendering the title with `DocsTitle` in `page.tsx`, you can put the title into MDX file.
  This will render the title in the MDX body.
</Callout>

Edit on GitHub [#edit-on-github]

<FeedbackBlock id="57e31a3ab259bf75" body="Link to the original GitHub file with your component.">
  Link to the original GitHub file with your component.
</FeedbackBlock>

```tsx
// docs layout:
import { DocsPage } from 'fumadocs-ui/layouts/docs/page';
// notebook layout:
import { DocsPage } from 'fumadocs-ui/layouts/notebook/page';

<DocsPage>
  <a
    href={`https://github.com/fuma-nama/fumadocs/blob/main/content/docs/${page.path}`}
    rel="noreferrer noopener"
    target="_blank"
    className="w-fit border rounded-xl p-2 font-medium text-sm text-fd-secondary-foreground bg-fd-secondary transition-colors hover:text-fd-accent-foreground hover:bg-fd-accent"
  >
    Edit on GitHub
  </a>
</DocsPage>;
```

Last Updated Time [#last-updated-time]

<FeedbackBlock id="c8f6ead244cd9559" body="Display last updated time of the page.">
  Display last updated time of the page.
</FeedbackBlock>

```tsx
// docs layout:
import { DocsPage, PageLastUpdate } from 'fumadocs-ui/layouts/docs/page';
// notebook layout:
import { DocsPage, PageLastUpdate } from 'fumadocs-ui/layouts/notebook/page';

const lastModifiedTime: Date | undefined;

<DocsPage>
  {/* Other content */}
  {lastModifiedTime && <PageLastUpdate date={lastModifiedTime} />}
</DocsPage>;
```

<FeedbackBlock id="10e79807197f88e3" body="For lastModifiedTime, you can possibly use different version controls like Github or a CMS.">
  For `lastModifiedTime`, you can possibly use different version controls like Github or a CMS.
</FeedbackBlock>

<Tabs items={['Fumadocs MDX', 'GitHub API']}>
  <Tab>
    You can enable [`lastModified`](/docs/mdx/last-modified).

    ```tsx
    import { source } from '@/lib/source';
    const page = source.getPage(['...']);

    const lastModifiedTime = page.data.lastModified;
    ```
  </Tab>

  <Tab>
    For Github hosted documents, you can use
    the [`getGithubLastEdit`](/docs/headless/utils/git-last-edit) utility.

    ```tsx
    import { getGithubLastEdit } from 'fumadocs-core/content/github';

    const lastModifiedTime = await getGithubLastEdit({
      owner: 'fuma-nama',
      repo: 'fumadocs',
      // file path in Git
      path: `content/docs/${page.path}`,
    });
    ```
  </Tab>
</Tabs>

Configurations [#configurations]

Full Mode [#full-mode]

<FeedbackBlock
  id="42f80dc945c9c6bc"
  body="To extend the page to fill up all available space, pass full to the page component.
This will force TOC to be shown as a popover."
>
  To extend the page to fill up all available space, pass `full` to the page component.
  This will force TOC to be shown as a popover.
</FeedbackBlock>

```tsx
// docs layout:
import { DocsPage } from 'fumadocs-ui/layouts/docs/page';
// notebook layout:
import { DocsPage } from 'fumadocs-ui/layouts/notebook/page';

<DocsPage full>...</DocsPage>;
```

Table of Contents [#table-of-contents]

<FeedbackBlock id="c49c337e694e0369" body="An overview of all the headings in your article, it requires an array of headings.">
  An overview of all the headings in your article, it requires an array of headings.
</FeedbackBlock>

<FeedbackBlock
  id="1029c346fdeb3716"
  body="For Markdown and MDX documents, You can obtain it using the
TOC Utility. Content sources like Fumadocs MDX offer this out-of-the-box."
>
  For Markdown and MDX documents, You can obtain it using the
  [TOC Utility](/docs/headless/utils/get-toc). Content sources like Fumadocs MDX offer this out-of-the-box.
</FeedbackBlock>

```tsx
// docs layout:
import { DocsPage } from 'fumadocs-ui/layouts/docs/page';
// notebook layout:
import { DocsPage } from 'fumadocs-ui/layouts/notebook/page';

<DocsPage toc={headings}>...</DocsPage>;
```

<FeedbackBlock id="322c16c45c8c9c3d" body="You can customise or disable it with the tableOfContent option, or with tableOfContentPopover on smaller devices.">
  You can customise or disable it with the `tableOfContent` option, or with `tableOfContentPopover` on smaller devices.
</FeedbackBlock>

```tsx
// docs layout:
import { DocsPage } from 'fumadocs-ui/layouts/docs/page';
// notebook layout:
import { DocsPage } from 'fumadocs-ui/layouts/notebook/page';

<DocsPage tableOfContent={options} tableOfContentPopover={options}>
  ...
</DocsPage>;
```

<TypeTable
  type={{
  "name": "TOCProps",
  "description": "",
  "entries": [
    {
      "name": "single",
      "description": "Only accept one active item at most",
      "tags": [
        {
          "name": "defaultValue",
          "text": "false"
        }
      ],
      "type": "boolean | undefined",
      "simplifiedType": "boolean",
      "required": false,
      "deprecated": false
    },
    {
      "name": "header",
      "description": "Custom content in TOC container, before the main TOC",
      "tags": [],
      "type": "ReactNode",
      "simplifiedType": "ReactNode",
      "required": false,
      "deprecated": false
    },
    {
      "name": "footer",
      "description": "Custom content in TOC container, after the main TOC",
      "tags": [],
      "type": "ReactNode",
      "simplifiedType": "ReactNode",
      "required": false,
      "deprecated": false
    },
    {
      "name": "enabled",
      "description": "",
      "tags": [],
      "type": "boolean | undefined",
      "simplifiedType": "boolean",
      "required": false,
      "deprecated": false
    },
    {
      "name": "component",
      "description": "",
      "tags": [],
      "type": "ReactNode",
      "simplifiedType": "ReactNode",
      "required": false,
      "deprecated": false
    },
    {
      "name": "style",
      "description": "",
      "tags": [
        {
          "name": "defaultValue",
          "text": "'normal'"
        }
      ],
      "type": "\"normal\" | \"clerk\" | undefined",
      "simplifiedType": "\"clerk\" | \"normal\"",
      "required": false,
      "deprecated": false
    }
  ]
}}
/>

Style [#style]

<FeedbackBlock id="cc47b6b6d6a0670a" body="You can choose another style for TOC, like clerk inspired by https://clerk.com:">
  You can choose another style for TOC, like `clerk` inspired by [https://clerk.com](https://clerk.com):
</FeedbackBlock>

```tsx
// docs layout:
import { DocsPage } from 'fumadocs-ui/layouts/docs/page';
// notebook layout:
import { DocsPage } from 'fumadocs-ui/layouts/notebook/page';

<DocsPage
  tableOfContent={{
    style: 'clerk',
  }}
>
  ...
</DocsPage>;
```

<FeedbackBlock id="f2e2607896248d1e" body="You can also style the TOC title with the toc-title ID.">
  You can also style the TOC title with the `toc-title` ID.
</FeedbackBlock>

Footer [#footer]

<FeedbackBlock id="c57dde00d1157c77" body="Footer is a navigation element that has two buttons to jump to the next and previous pages. When not specified, it shows the neighbour pages found from page tree.">
  Footer is a navigation element that has two buttons to jump to the next and previous pages. When not specified, it shows the neighbour pages found from page tree.
</FeedbackBlock>

<FeedbackBlock id="c460651e10c6621d" body="Customise the footer with the footer option.">
  Customise the footer with the `footer` option.
</FeedbackBlock>

```tsx
// docs layout:
import { DocsPage } from 'fumadocs-ui/layouts/docs/page';
// notebook layout:
import { DocsPage } from 'fumadocs-ui/layouts/notebook/page';

<DocsPage footer={options}>...</DocsPage>;
```

<TypeTable
  type={{
  "name": "FooterProps",
  "description": "",
  "entries": [
    {
      "name": "enabled",
      "description": "",
      "tags": [],
      "type": "boolean | undefined",
      "simplifiedType": "boolean",
      "required": false,
      "deprecated": false
    },
    {
      "name": "component",
      "description": "",
      "tags": [],
      "type": "ReactNode",
      "simplifiedType": "ReactNode",
      "required": false,
      "deprecated": false
    },
    {
      "name": "items",
      "description": "Items including information for the next and previous page",
      "tags": [],
      "type": "{ previous?: Item; next?: Item; } | undefined",
      "simplifiedType": "object",
      "required": false,
      "deprecated": false
    }
  ]
}}
/>

Breadcrumb [#breadcrumb]

<FeedbackBlock id="de17f06b4239205a" body="A navigation element, shown only when user is navigating in folders.">
  A navigation element, shown only when user is navigating in folders.
</FeedbackBlock>

<TypeTable
  type={{
  "name": "BreadcrumbProps",
  "description": "",
  "entries": [
    {
      "name": "enabled",
      "description": "",
      "tags": [],
      "type": "boolean | undefined",
      "simplifiedType": "boolean",
      "required": false,
      "deprecated": false
    },
    {
      "name": "component",
      "description": "",
      "tags": [],
      "type": "ReactNode",
      "simplifiedType": "ReactNode",
      "required": false,
      "deprecated": false
    },
    {
      "name": "includeRoot",
      "description": "Include the root folders in the breadcrumb items array.",
      "tags": [
        {
          "name": "defaultValue",
          "text": "false"
        }
      ],
      "type": "boolean | { url: string; } | undefined",
      "simplifiedType": "object | boolean",
      "required": false,
      "deprecated": false
    },
    {
      "name": "includePage",
      "description": "Include the page itself in the breadcrumb items array",
      "tags": [
        {
          "name": "defaultValue",
          "text": "false"
        }
      ],
      "type": "boolean | undefined",
      "simplifiedType": "boolean",
      "required": false,
      "deprecated": false
    },
    {
      "name": "includeSeparator",
      "description": "Count separator as an item",
      "tags": [
        {
          "name": "defaultValue",
          "text": "false"
        }
      ],
      "type": "boolean | undefined",
      "simplifiedType": "boolean",
      "required": false,
      "deprecated": false
    }
  ]
}}
/>
