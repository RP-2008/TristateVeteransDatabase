# VFW, ELKS & American Legion Directory (Next.js on Vercel)

## Upload to GitHub (no command line)
1) On GitHub, create a new repo.
2) Click **Add file → Upload files**.
3) In Finder, open this folder and **select all contents inside** (NOT the outer folder):
   - `pages/`
   - `data/`
   - `package.json`
   - `next.config.js`
4) Drag those into GitHub and **Commit changes**.

You should see these at the **top level** of your repo:
```
/pages
/data
package.json
next.config.js
```

## Deploy on Vercel
- Go to vercel.com → New Project → Import your repo → Deploy.

If you uploaded the whole folder as a subfolder by accident,
set **Root Directory** in Vercel → Project Settings → to that subfolder name, then Redeploy.
