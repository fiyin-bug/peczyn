# Fixing Vercel 404 NOT_FOUND

## 1. The fix (do this in Vercel dashboard)

Go to your project → **Settings** → **General**. Set **all** of these:

| Setting | Value | Why |
|--------|--------|-----|
| **Root Directory** | `luxury-perfume` | Must be **all lowercase**. Your site files live in this folder. |
| **Framework Preset** | **Other** | So Vercel treats it as a static site, not Next/Vite etc. |
| **Build Command** | *(leave empty)* | No build step; we're serving static HTML. |
| **Output Directory** | *(leave empty)* | **Critical.** If this is `dist` or `build`, Vercel serves an empty folder → 404. Leave blank so it serves the root. |

Then go to **Deployments** → open the **⋯** on the latest → **Redeploy** (don’t use cache).

After redeploy, the site should load at your deployment URL instead of 404.

---

## 2. Why this happened (root cause)

- **What the code is doing:** Your site files (`index.html`, `vercel.json`, `css/`, etc.) live inside a folder named `luxury-perfume`. Your Git repo root is the **parent** of that folder (so the repo has one top-level directory: `luxury-perfume/`).
- **What Vercel does by default:** It uses the **repository root** as the deployment root. So after clone, the “website root” is the folder that only contains the subfolder `luxury-perfume/` — there is no `index.html` at that level.
- **What actually happens:** When you open `https://your-app.vercel.app/`, Vercel looks for `index.html` at the deployment root. It isn’t there (it’s in `luxury-perfume/index.html`), so it returns **404 NOT_FOUND**.
- **What was missing:** Telling Vercel that the “root” of the site is the `luxury-perfume` subfolder, not the repo root.

So: the 404 is from a **mismatch between repo layout and Vercel’s “root directory”**, not from broken links or a typo in the URL.

---

## 3. Underlying idea

- **Why NOT_FOUND exists:** The server must respond for every URL. If it can’t find a file (or a route) for that path, it returns 404 so clients and crawlers know “this resource doesn’t exist here.”
- **Mental model:** For static sites, “the site” is a **directory tree**. The server’s “document root” is the top of that tree. Only files under that root can be served. If your `index.html` is not under the root Vercel is using, `/` has nothing to serve → 404.
- **How this fits:** Vercel (and most hosts) have a **Root Directory** (or “document root”) setting so you can say: “The site to serve is inside this subfolder of the repo.” Without that, the repo root is the document root.

---

## 4. What to watch for next time

- **Repo structure:** If your site lives in a **subfolder** of the repo (e.g. `luxury-perfume/`), you must set **Root Directory** in Vercel to that folder. Otherwise you’ll get 404 on `/` and often on assets.
- **Same mistake elsewhere:** Any host that has a “root directory” or “public folder” (Netlify, Cloudflare Pages, etc.) will behave the same way if the root points at the wrong folder.
- **Code smell:** You see a 404 on the **homepage** or on **all pages** even though the files exist in the repo — that usually means “wrong root directory,” not “wrong file names.”

---

## 5. Other options and trade-offs

| Approach | Trade-off |
|----------|-----------|
| **Set Root Directory to `luxury-perfume`** (recommended) | One setting in Vercel; no repo changes. Easiest and what we recommend. |
| Move site files to the repo root | So the repo root = site root. Requires moving files and updating any paths; only worth it if you want the repo root to always be the site. |
| Use a monorepo preset | If the repo had multiple apps, you’d point each Vercel project at its own subfolder. Same idea: root directory = which folder is “the app.” |

---

**Summary:** Set **Root Directory** in Vercel to **`luxury-perfume`**, leave **Output Directory** and **Build Command** empty, set **Framework Preset** to **Other**, then redeploy (without cache).

---

## 6. Still 404? Double-check

- **Output Directory** is the #1 cause after Root Directory. If it’s set to `dist`, `build`, or `.vercel/output`, clear it so the field is empty.
- Use **Redeploy** → **Redeploy without using cache** so old build config isn’t reused.
- Open the **production** URL (e.g. `https://your-project.vercel.app`), not an old or preview link.
- In **Deployments**, confirm the latest deployment status is **Ready** (not Failed or Canceled).
