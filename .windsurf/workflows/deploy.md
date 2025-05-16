---
description: deploy directly to custom domain using netlify
---

To deploy directly to www.voice101.ai using the Netlify CLI, you can use this command:

bash
CopyInsert in Terminal
npx netlify deploy --prod --alias=www.voice101.ai
However, before running this command, please ensure that:

The domain www.voice101.ai is already added to your Netlify site in the Netlify dashboard.
The domain's DNS is properly configured to point to Netlify's servers.
Complete Steps:
First, make sure you're logged in to Netlify:
bash
CopyInsert in Terminal
npx netlify login
Link your project (if not already linked):
bash
CopyInsert in Terminal
npx netlify link
Deploy to production with the alias:
bash
CopyInsert in Terminal
npx netlify deploy --prod --alias=www.voice101.ai
Important Notes:
The --alias flag creates a redirect from the specified domain to your production site.
Make sure your netlify.toml file is properly configured for production builds.
If you want to set this domain as the primary domain, you should do that through the Netlify dashboard for better management