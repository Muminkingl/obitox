# Documentation Migration Plan: src/app/docs → src/app/docs-new

## Overview

Migrate documentation content from the legacy custom React-based `src/app/docs/` directory to the new Fumadocs-based `src/app/docs-new/` UI implementation.

---

## 1. Current State Analysis

### Legacy Structure (src/app/docs/)
```
src/app/docs/
├── layout.tsx                         # Custom layout with DocsSidebar + DocsToc
├── page.tsx                           # Introduction page (ObitoX welcome)
├── [slug]/                            # Dynamic route placeholder
├── installation/
│   └── page.tsx                       # Multi-framework installation guide
├── quick-start/
│   └── page.tsx                       # Quick start tutorial
└── providers/
    ├── s3/
    │   └── page.tsx                   # S3 provider documentation (2080 lines!)
    ├── r2/
    │   └── page.tsx                   # Cloudflare R2 documentation (1149 lines!)
    ├── supabase/
    │   └── page.tsx                   # Supabase provider documentation
    └── uploadcare/
        └── page.tsx                   # Uploadcare provider documentation
```

### New Structure (src/app/docs-new/)
```
src/app/docs-new/
├── layout.tsx                         # Fumadocs DocsLayout wrapper
├── page.tsx                           # Introduction page (placeholder content)
├── components/
│   ├── breadcrumb/
│   │   └── page.tsx
│   └── toc/
│       └── page.tsx
└── installation/
    └── page.tsx                       # Installation page (placeholder content)
```

---

## 2. Technology Stack Comparison

| Aspect | Legacy (src/app/docs/) | New (src/app/docs-new/) |
|--------|------------------------|-------------------------|
| Framework | Next.js 16 + Custom Components | Next.js 16 + Fumadocs |
| Content Format | React Components (TSX) | React Components (TSX) |
| Navigation | Custom DocsSidebar + config | Fumadocs tree configuration |
| Components | Custom CodeBlock, Cards | Fumadocs Steps, Cards, etc. |
| Styling | Tailwind CSS (dark theme) | Fumadocs UI + Tailwind CSS |
| Layout | Custom 3-column layout | Fumadocs DocsLayout |
| TOC | Custom DocsToc component | Fumadocs built-in TOC |

---

## 3. Migration Strategy

### Phase 1: Setup & Foundation ✅
- [x] Review Fumadocs layout implementation
- [x] Understand page tree structure
- [x] Identify required custom components

### Phase 2: Core Pages Migration
- [ ] Introduction page - Migrate ObitoX welcome content
- [ ] Installation page - Migrate multi-framework installation guide
- [ ] Quick Start page - Migrate tutorial content

### Phase 3: Provider Pages Migration
- [ ] S3 Provider page (2080 lines - complex with framework tabs)
- [ ] R2 Provider page (1149 lines - complex with framework tabs)
- [ ] Supabase Provider page
- [ ] Uploadcare Provider page

### Phase 4: Navigation & Polish
- [ ] Update page tree in layout.tsx with all pages
- [ ] Ensure CodeBlock component works with Fumadocs
- [ ] Verify all internal links work
- [ ] Test responsive layout
- [ ] Test dark mode compatibility

---

## 4. Component Mapping Guide

### Legacy Custom Components → Fumadocs Components

| Legacy Component | New Component |
|-----------------|---------------|
| `<CodeBlock>` from `@/components/docs/code-block` | `<CodeBlock>` from `@/components/fumadocs/components` |
| Custom framework tabs (useState) | Keep same pattern or use Fumadocs Tabs |
| Custom warning/info boxes | Fumadocs Callout or custom Alert |
| `<DocsSidebar>` | Fumadocs built-in sidebar |
| `<DocsToc>` | Fumadocs built-in TOC |
| `<QuickstartCard>` | `<Card>` from fumadocs-ui |
| `<NextStepLink>` | Custom or `<Card>` with link |

### Existing Components to Reuse
1. **CodeBlock** - Already exists at `@/components/fumadocs/components`
2. **Steps** - From `fumadocs-ui/components/steps`
3. **Cards** - From `fumadocs-ui/components/card`

### Components to Create/Adapt
1. **Framework Tabs** - For multi-language code examples (S3, R2 pages)
2. **Warning/Info Boxes** - Styled alert components
3. **QuickstartCard** - Grid of framework links

---

## 5. Page Template Structure

Each migrated page should follow this pattern (based on existing docs-new pages):

```tsx
'use client';

import { DocsPage, DocsDescription, DocsTitle, DocsBody } from 'fumadocs-ui/layouts/docs/page';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import { Cards, Card } from 'fumadocs-ui/components/card';
import { CodeBlock } from '@/components/fumadocs/components';
import Link from 'next/link';

const tocItems = [
    { title: 'Section Name', url: '#section-id', depth: 2 },
    // ... more TOC entries
];

export default function Page() {
    return (
        <DocsPage toc={tocItems}>
            <DocsTitle>Page Title</DocsTitle>
            <DocsDescription>Page description for SEO</DocsDescription>
            <DocsBody>
                {/* Content here */}
                <h2 id="section-id" className="scroll-m-20">Section Title</h2>
                <p>Content paragraph...</p>
                
                <CodeBlock title="Terminal">
                    npm install obitox
                </CodeBlock>
                
                <div className="h-[200px]"></div> {/* Bottom spacing */}
            </DocsBody>
        </DocsPage>
    );
}
```

---

## 6. Navigation Tree Structure

The `layout.tsx` file contains the page tree. Update to include all pages:

```tsx
const tree = {
    name: 'Docs',
    children: [
        // Getting Started
        {
            type: 'page' as const,
            name: 'Introduction',
            url: '/docs-new',
        },
        {
            type: 'page' as const,
            name: 'Installation',
            url: '/docs-new/installation',
        },
        {
            type: 'page' as const,
            name: 'Quick Start',
            url: '/docs-new/quick-start',
        },
        // Providers
        {
            type: 'separator' as const,
            name: 'Providers',
        },
        {
            type: 'page' as const,
            name: 'Amazon S3',
            url: '/docs-new/providers/s3',
        },
        {
            type: 'page' as const,
            name: 'Cloudflare R2',
            url: '/docs-new/providers/r2',
        },
        {
            type: 'page' as const,
            name: 'Supabase',
            url: '/docs-new/providers/supabase',
        },
        {
            type: 'page' as const,
            name: 'Uploadcare',
            url: '/docs-new/providers/uploadcare',
        },
    ],
};
```

---

## 7. Files to Create/Modify

### Page Files to Create
1. `src/app/docs-new/quick-start/page.tsx` - From `src/app/docs/quick-start/page.tsx`
2. `src/app/docs-new/providers/s3/page.tsx` - From `src/app/docs/providers/s3/page.tsx`
3. `src/app/docs-new/providers/r2/page.tsx` - From `src/app/docs/providers/r2/page.tsx`
4. `src/app/docs-new/providers/supabase/page.tsx` - From `src/app/docs/providers/supabase/page.tsx`
5. `src/app/docs-new/providers/uploadcare/page.tsx` - From `src/app/docs/providers/uploadcare/page.tsx`

### Page Files to Update (already exist but have placeholder content)
1. `src/app/docs-new/page.tsx` - Update with ObitoX introduction content
2. `src/app/docs-new/installation/page.tsx` - Update with multi-framework installation

### Files to Modify
1. `src/app/docs-new/layout.tsx` - Update navigation tree with all pages
2. `src/lib/fumadocs/layout.shared.tsx` - Update title to "ObitoX Docs"

### Components to Verify/Adapt
1. `src/components/fumadocs/components.tsx` - Ensure CodeBlock works
2. May need to create framework tabs component for provider pages

---

## 8. Migration Checklist

### Before Starting ✅
- [x] Review legacy documentation structure (src/app/docs/)
- [x] Review new Fumadocs implementation (src/app/docs-new/)
- [x] Identify all content pages (7 pages total)
- [x] Plan component requirements

### Per Page Migration
- [ ] Copy content from legacy page
- [ ] Adapt to Fumadocs DocsPage structure
- [ ] Update TOC items array
- [ ] Update navigation tree in layout.tsx
- [ ] Verify internal links work
- [ ] Test in browser

### Final Verification
- [ ] All 7 pages accessible
- [ ] Navigation sidebar shows all pages
- [ ] TOC works on each page
- [ ] Dark mode works
- [ ] Mobile responsive
- [ ] No broken links

---

## 9. Pages Summary

| Page | Source | Complexity | Notes |
|------|--------|------------|-------|
| Introduction | `src/app/docs/page.tsx` | Low | Welcome + framework cards |
| Installation | `src/app/docs/installation/page.tsx` | High | Multi-framework tabs (8 frameworks) |
| Quick Start | `src/app/docs/quick-start/page.tsx` | Medium | Tutorial with code blocks |
| S3 Provider | `src/app/docs/providers/s3/page.tsx` | Very High | 2080 lines, 6 framework tabs |
| R2 Provider | `src/app/docs/providers/r2/page.tsx` | High | 1149 lines, 6 framework tabs |
| Supabase | `src/app/docs/providers/supabase/page.tsx` | Medium | Provider docs |
| Uploadcare | `src/app/docs/providers/uploadcare/page.tsx` | Medium | Provider docs |

---

## 10. Next Steps

1. **Switch to Code mode** to implement the migration
2. **Start with Introduction page** - Update `src/app/docs-new/page.tsx` with ObitoX content
3. **Migrate Installation page** - Update with multi-framework content
4. **Create Quick Start page** - New file
5. **Create Provider pages** - New files in providers/ directory
6. **Update navigation tree** - Add all pages to layout.tsx
