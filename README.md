This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Template Congreso

## Fonts

### Merriweather Font
The project now uses **Merriweather** as the primary font for all headings and titles. This font provides excellent readability and a professional appearance.

#### Available Font Classes

**Tailwind CSS Classes:**
- `font-heading` - Default heading font (Merriweather)
- `font-heading-light` - Merriweather Light (300)
- `font-heading-regular` - Merriweather Regular (400)
- `font-heading-bold` - Merriweather Bold (700)
- `font-heading-black` - Merriweather Black (900)

**CSS Classes:**
- `.font-title` - Title styling with Merriweather Bold
- `.font-heading-merriweather` - Merriweather font family
- `.font-heading-light` - Merriweather Light weight
- `.font-heading-regular` - Merriweather Regular weight
- `.font-heading-bold` - Merriweather Bold weight
- `.font-heading-black` - Merriweather Black weight

#### Usage Examples

```tsx
// Using Tailwind classes
<h1 className="text-4xl font-heading text-gray-900">Main Title</h1>
<h2 className="text-2xl font-heading-bold text-blue-600">Section Title</h2>

// Using CSS classes
<h3 className="font-title text-xl">Subtitle</h3>
<p className="font-heading-regular">Important text</p>
```

#### Automatic Application
All `<h1>`, `<h2>`, `<h3>`, `<h4>`, `<h5>`, and `<h6>` elements automatically use Merriweather font through CSS.
