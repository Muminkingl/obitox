# Installation

> Get started with the ObitoX SDK in minutes

## Prerequisites

Before you begin, you'll need:
* An ObitoX account with API credentials
* [Create an API key](https://obitox.com/dashboard/api-keys) from your dashboard

## 1. Install

Get the ObitoX Node.js SDK.

<CodeGroup>
  ```bash npm theme={"theme":{"light":"github-light","dark":"vesper"}}
  npm install obitox
  ```

  ```bash yarn theme={"theme":{"light":"github-light","dark":"vesper"}}
  yarn add obitox
  ```

  ```bash pnpm theme={"theme":{"light":"github-light","dark":"vesper"}}
  pnpm add obitox
  ```

  ```bash bun theme={"theme":{"light":"github-light","dark":"vesper"}}
  bun add obitox
  ```
</CodeGroup>

## 2. Initialize the Client

Create a new ObitoX client with your API credentials.

```ts lib/obitox.ts theme={"theme":{"light":"github-light","dark":"vesper"}}
import ObitoX from 'obitox';

const client = new ObitoX({
  apiKey: process.env.OBITOX_API_KEY  // ox_xxx...
});

const secureClient = new ObitoX({
  apiKey: process.env.OBITOX_API_KEY,     // ox_xxx...
  apiSecret: process.env.OBITOX_API_SECRET // sk_xxx...
});
```


## Environment Variables

Store your credentials securely in environment variables.

```bash .env.local theme={"theme":{"light":"github-light","dark":"vesper"}}
# ObitoX API Credentials
OBITOX_API_KEY=ox_xxxxxxxxxxxxxxxxxxxx
OBITOX_API_SECRET=sk_xxxxxxxxxxxxxxxxxxxx

# Provider credentials (add only the ones you use)
UPLOADCARE_PUBLIC_KEY=your-public-key
UPLOADCARE_SECRET_KEY=your-secret-key
```

## TypeScript Support

The SDK is built with TypeScript and provides full type safety.

```ts theme={"theme":{"light":"github-light","dark":"vesper"}}
import ObitoX from 'obitox';
import type { ObitoXConfig, UploadOptions } from 'obitox';

const config: ObitoXConfig = {
  apiKey: process.env.OBITOX_API_KEY!,
  apiSecret: process.env.OBITOX_API_SECRET
};

const client = new ObitoX(config);
```

## Next Steps

- [Authentication](/docs/authentication) - Learn about Layer 2 security
- [Quick Start](/docs/quick-start) - Build your first integration
- [File Upload](/docs/file-upload) - Deep dive into upload options
