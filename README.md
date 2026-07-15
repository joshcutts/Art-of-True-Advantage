# The Art of True Advantage — book website

Marketing site and blog for the book *The Art of True Advantage*, live at [artoftrueadvantage.com](https://artoftrueadvantage.com/).

I built and maintain this site end to end: design, implementation, SEO, and the email integration.

## What it does

- **Landing page** — book overview, reviews, author bio, and contact form, built as plain Astro components with no UI framework.
- **Blog** — posts are Markdown files validated by a Zod schema via Astro content collections, rendered to static pages.
- **Decap CMS Admin Portal** - a headless, git-based CMS dashboard integrated directly into /admin. Authors can securely log in, draft, edit, and publish rich markdown blog posts directly to the GitHub repository without editing code.
- **Email-gated posts** — blog articles sit behind a subscribe wall backed by [MailerLite](https://www.mailerlite.com/). Two server endpoints (`/api/verify-subscriber`, `/api/subscribe`) check whether a reader is already on the list or add them, then the gate unlocks in place without a page reload. This is a soft gate for lead capture, not access control — the post content is statically rendered and the lock is enforced client-side.
- **SEO basics** — sitemap, Open Graph tags, meta descriptions, and a content security policy meta tag.

## Stack

- [Astro](https://astro.build/) 6: pages prerender to static HTML; the two API routes run server-side (Netlify adapter)
-	Decap CMS — open-source, Git-based headless content management engine
- Netlify Identity & Git Gateway — secure OAuth bridge for author authentication
- Vanilla CSS and JavaScript — no component framework, no CSS framework
- MailerLite v3 API for the mailing list
- TypeScript for the API endpoints and content schema


## Running locally

Requires Node ≥ 22.12.

```sh
npm install
npm run dev        # dev server at localhost:4321
npm run build      # production build to ./dist/
```

The subscribe/verify endpoints need a `MAILERLITE_API_KEY` environment variable (e.g. in a `.env` file). Everything else works without it.

## Structure

```
src/
├── components/     # landing page sections (Navbar, Landing, About, Review, ...)
├── content/blog/   # blog posts as Markdown
├── layouts/        # shared page layout with meta/OG tags
└── pages/
    ├── index.astro         # landing page
    ├── blog/               # blog index + post pages with subscribe gate
    └── api/                # MailerLite subscribe + verify endpoints
```

## How the Headless CMS Pipeline Works

[ Author Logs In at /admin ] ──► [ Netlify Identity Authentication ]
                                                │
                                                ▼ (Access Granted)
[ Author Edits/Publishes Post ] ──► [ Decap CMS Writes Markdown to GitHub ]
                                                │
                                                ▼ (Git Trigger)
                                    [ Netlify Automatically Rebuilds Site ]

	1.	Authentication: Netlify Identity provides a secure, passwordless login portal on the static /admin page.
	2.	Commit Pipeline (Git Gateway): Once logged in, Decap CMS acts as a visual interface for our GitHub repository. Saving or publishing a post commits a newly generated markdown file directly to src/content/blog/ in our codebase.
	3.	Continuous Deployment: The GitHub commit triggers a Netlify build hook, compilation of static pages via Astro, and live deployment of the new article automatically.@

## Things I'd improve

- Move the gate's unlock state server-side (or to a signed cookie) if the content ever needs real protection.
- Add automated tests around the API endpoints; right now they're verified manually.
- Extract the inline styles/scripts in the blog post page into shared files as the blog grows.
