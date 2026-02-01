# Fumadocs CLI (the CLI tool for automating Fumadocs apps): User Guide
URL: /docs/cli
Source: https://raw.githubusercontent.com/fuma-nama/fumadocs/refs/heads/main/apps/docs/content/docs/cli/index.mdx

The CLI tool that automates setups and installs components.
        


Installation [#installation]

<FeedbackBlock id="f0052ac77421409b" body="Initialize a config for CLI:">
  Initialize a config for CLI:
</FeedbackBlock>

<CodeBlockTabs defaultValue="npm" groupId="package-manager" persist>
  <CodeBlockTabsList>
    <CodeBlockTabsTrigger value="npm">
      npm
    </CodeBlockTabsTrigger>

    <CodeBlockTabsTrigger value="pnpm">
      pnpm
    </CodeBlockTabsTrigger>

    <CodeBlockTabsTrigger value="yarn">
      yarn
    </CodeBlockTabsTrigger>

    <CodeBlockTabsTrigger value="bun">
      bun
    </CodeBlockTabsTrigger>
  </CodeBlockTabsList>

  <CodeBlockTab value="npm">
    ```bash
    npx @fumadocs/cli
    ```
  </CodeBlockTab>

  <CodeBlockTab value="pnpm">
    ```bash
    pnpm dlx @fumadocs/cli
    ```
  </CodeBlockTab>

  <CodeBlockTab value="yarn">
    ```bash
    yarn dlx @fumadocs/cli
    ```
  </CodeBlockTab>

  <CodeBlockTab value="bun">
    ```bash
    bun x @fumadocs/cli
    ```
  </CodeBlockTab>
</CodeBlockTabs>

<FeedbackBlock id="479ebee7d3e7d067" body="You can change the output paths of components in the config.">
  You can change the output paths of components in the config.
</FeedbackBlock>

Components [#components]

<FeedbackBlock id="009b28102292e881" body="Select and install components.">
  Select and install components.
</FeedbackBlock>

<CodeBlockTabs defaultValue="npm" groupId="package-manager" persist>
  <CodeBlockTabsList>
    <CodeBlockTabsTrigger value="npm">
      npm
    </CodeBlockTabsTrigger>

    <CodeBlockTabsTrigger value="pnpm">
      pnpm
    </CodeBlockTabsTrigger>

    <CodeBlockTabsTrigger value="yarn">
      yarn
    </CodeBlockTabsTrigger>

    <CodeBlockTabsTrigger value="bun">
      bun
    </CodeBlockTabsTrigger>
  </CodeBlockTabsList>

  <CodeBlockTab value="npm">
    ```bash
    npx @fumadocs/cli add
    ```
  </CodeBlockTab>

  <CodeBlockTab value="pnpm">
    ```bash
    pnpm dlx @fumadocs/cli add
    ```
  </CodeBlockTab>

  <CodeBlockTab value="yarn">
    ```bash
    yarn dlx @fumadocs/cli add
    ```
  </CodeBlockTab>

  <CodeBlockTab value="bun">
    ```bash
    bun x @fumadocs/cli add
    ```
  </CodeBlockTab>
</CodeBlockTabs>

<FeedbackBlock id="4eb4ed5ff1e1b461" body="You can pass component names directly.">
  You can pass component names directly.
</FeedbackBlock>

<CodeBlockTabs defaultValue="npm" groupId="package-manager" persist>
  <CodeBlockTabsList>
    <CodeBlockTabsTrigger value="npm">
      npm
    </CodeBlockTabsTrigger>

    <CodeBlockTabsTrigger value="pnpm">
      pnpm
    </CodeBlockTabsTrigger>

    <CodeBlockTabsTrigger value="yarn">
      yarn
    </CodeBlockTabsTrigger>

    <CodeBlockTabsTrigger value="bun">
      bun
    </CodeBlockTabsTrigger>
  </CodeBlockTabsList>

  <CodeBlockTab value="npm">
    ```bash
    npx @fumadocs/cli add banner files
    ```
  </CodeBlockTab>

  <CodeBlockTab value="pnpm">
    ```bash
    pnpm dlx @fumadocs/cli add banner files
    ```
  </CodeBlockTab>

  <CodeBlockTab value="yarn">
    ```bash
    yarn dlx @fumadocs/cli add banner files
    ```
  </CodeBlockTab>

  <CodeBlockTab value="bun">
    ```bash
    bun x @fumadocs/cli add banner files
    ```
  </CodeBlockTab>
</CodeBlockTabs>

How the magic works? [#how-the-magic-works]

<FeedbackBlock
  id="ee03cd0edbb684e0"
  body="The CLI fetches the latest version of component from the GitHub repository of Fumadocs.
When you install a component, it is guaranteed to be up-to-date."
>
  The CLI fetches the latest version of component from the GitHub repository of Fumadocs.
  When you install a component, it is guaranteed to be up-to-date.
</FeedbackBlock>

<FeedbackBlock
  id="00a3563fcd43937e"
  body="In addition, it also transforms import paths.
Make sure to use the latest version of CLI"
>
  In addition, it also transforms import paths.
  Make sure to use the latest version of CLI
</FeedbackBlock>

> <FeedbackBlock id="5aa396360c5a14fd" body="This is highly inspired by Shadcn UI.">
>   This is highly inspired by Shadcn UI.
> </FeedbackBlock>

Customise [#customise]

<FeedbackBlock id="c1c3a671574da8ef" body="A simple way to customise Fumadocs layouts.">
  A simple way to customise Fumadocs layouts.
</FeedbackBlock>

<CodeBlockTabs defaultValue="npm" groupId="package-manager" persist>
  <CodeBlockTabsList>
    <CodeBlockTabsTrigger value="npm">
      npm
    </CodeBlockTabsTrigger>

    <CodeBlockTabsTrigger value="pnpm">
      pnpm
    </CodeBlockTabsTrigger>

    <CodeBlockTabsTrigger value="yarn">
      yarn
    </CodeBlockTabsTrigger>

    <CodeBlockTabsTrigger value="bun">
      bun
    </CodeBlockTabsTrigger>
  </CodeBlockTabsList>

  <CodeBlockTab value="npm">
    ```bash
    npx @fumadocs/cli customise
    ```
  </CodeBlockTab>

  <CodeBlockTab value="pnpm">
    ```bash
    pnpm dlx @fumadocs/cli customise
    ```
  </CodeBlockTab>

  <CodeBlockTab value="yarn">
    ```bash
    yarn dlx @fumadocs/cli customise
    ```
  </CodeBlockTab>

  <CodeBlockTab value="bun">
    ```bash
    bun x @fumadocs/cli customise
    ```
  </CodeBlockTab>
</CodeBlockTabs>

Tree [#tree]

<FeedbackBlock id="eb83362024a147ac" body="Generate files tree for Fumadocs UI Files component, using the tree command from your terminal.">
  Generate files tree for Fumadocs UI `Files` component, using the `tree` command from your terminal.
</FeedbackBlock>

<CodeBlockTabs defaultValue="npm" groupId="package-manager" persist>
  <CodeBlockTabsList>
    <CodeBlockTabsTrigger value="npm">
      npm
    </CodeBlockTabsTrigger>

    <CodeBlockTabsTrigger value="pnpm">
      pnpm
    </CodeBlockTabsTrigger>

    <CodeBlockTabsTrigger value="yarn">
      yarn
    </CodeBlockTabsTrigger>

    <CodeBlockTabsTrigger value="bun">
      bun
    </CodeBlockTabsTrigger>
  </CodeBlockTabsList>

  <CodeBlockTab value="npm">
    ```bash
    npx @fumadocs/cli tree ./my-dir ./output.tsx
    ```
  </CodeBlockTab>

  <CodeBlockTab value="pnpm">
    ```bash
    pnpm dlx @fumadocs/cli tree ./my-dir ./output.tsx
    ```
  </CodeBlockTab>

  <CodeBlockTab value="yarn">
    ```bash
    yarn dlx @fumadocs/cli tree ./my-dir ./output.tsx
    ```
  </CodeBlockTab>

  <CodeBlockTab value="bun">
    ```bash
    bun x @fumadocs/cli tree ./my-dir ./output.tsx
    ```
  </CodeBlockTab>
</CodeBlockTabs>

<FeedbackBlock id="9f93cd9536720467" body="You can output MDX files too:">
  You can output MDX files too:
</FeedbackBlock>

<CodeBlockTabs defaultValue="npm" groupId="package-manager" persist>
  <CodeBlockTabsList>
    <CodeBlockTabsTrigger value="npm">
      npm
    </CodeBlockTabsTrigger>

    <CodeBlockTabsTrigger value="pnpm">
      pnpm
    </CodeBlockTabsTrigger>

    <CodeBlockTabsTrigger value="yarn">
      yarn
    </CodeBlockTabsTrigger>

    <CodeBlockTabsTrigger value="bun">
      bun
    </CodeBlockTabsTrigger>
  </CodeBlockTabsList>

  <CodeBlockTab value="npm">
    ```bash
    npx @fumadocs/cli tree ./my-dir ./output.mdx
    ```
  </CodeBlockTab>

  <CodeBlockTab value="pnpm">
    ```bash
    pnpm dlx @fumadocs/cli tree ./my-dir ./output.mdx
    ```
  </CodeBlockTab>

  <CodeBlockTab value="yarn">
    ```bash
    yarn dlx @fumadocs/cli tree ./my-dir ./output.mdx
    ```
  </CodeBlockTab>

  <CodeBlockTab value="bun">
    ```bash
    bun x @fumadocs/cli tree ./my-dir ./output.mdx
    ```
  </CodeBlockTab>
</CodeBlockTabs>

<FeedbackBlock id="a25db83634c4a151" body="See help for further details:">
  See help for further details:
</FeedbackBlock>

<CodeBlockTabs defaultValue="npm" groupId="package-manager" persist>
  <CodeBlockTabsList>
    <CodeBlockTabsTrigger value="npm">
      npm
    </CodeBlockTabsTrigger>

    <CodeBlockTabsTrigger value="pnpm">
      pnpm
    </CodeBlockTabsTrigger>

    <CodeBlockTabsTrigger value="yarn">
      yarn
    </CodeBlockTabsTrigger>

    <CodeBlockTabsTrigger value="bun">
      bun
    </CodeBlockTabsTrigger>
  </CodeBlockTabsList>

  <CodeBlockTab value="npm">
    ```bash
    npx @fumadocs/cli tree -h
    ```
  </CodeBlockTab>

  <CodeBlockTab value="pnpm">
    ```bash
    pnpm dlx @fumadocs/cli tree -h
    ```
  </CodeBlockTab>

  <CodeBlockTab value="yarn">
    ```bash
    yarn dlx @fumadocs/cli tree -h
    ```
  </CodeBlockTab>

  <CodeBlockTab value="bun">
    ```bash
    bun x @fumadocs/cli tree -h
    ```
  </CodeBlockTab>
</CodeBlockTabs>

Example Output [#example-output]

```tsx title="output.tsx"
import { File, Folder, Files } from 'fumadocs-ui/components/files';

export default (
  <Files>
    <Folder name="app">
      <File name="layout.tsx" />
      <File name="page.tsx" />
      <File name="global.css" />
    </Folder>
    <Folder name="components">
      <File name="button.tsx" />
      <File name="tabs.tsx" />
      <File name="dialog.tsx" />
    </Folder>
    <File name="package.json" />
  </Files>
);
```
