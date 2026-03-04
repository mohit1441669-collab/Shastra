# 🔥 Shastra — Deploy to Netlify

## What's in this folder

```
shastra-netlify/
├── index.html                  ← The full Shastra website
├── netlify.toml                ← Netlify configuration
├── package.json                ← Node-fetch dependency for the function
└── netlify/
    └── functions/
        └── chat.js             ← Secure API proxy (your key lives here)
```

---

## Deploy in 4 Steps

### Step 1 — Get your Anthropic API Key
1. Go to https://console.anthropic.com
2. Click **API Keys** → **Create Key**
3. Copy the key (looks like `sk-ant-api03-...`)

### Step 2 — Upload to Netlify
1. Go to https://netlify.com and sign up (free)
2. From your dashboard click **"Add new site"** → **"Deploy manually"**
3. **Drag and drop this entire `shastra-netlify` folder** onto the upload area
4. Netlify will deploy it in about 30 seconds

### Step 3 — Add your API Key
1. In Netlify, go to your site → **Site configuration** → **Environment variables**
2. Click **"Add a variable"**
3. Key:   `ANTHROPIC_API_KEY`
   Value: `sk-ant-your-key-here`
4. Click **Save**
5. Go to **Deploys** → Click **"Trigger deploy"** → **"Deploy site"**

### Step 4 — Done! 🎉
Your site is live at a URL like:
```
https://magical-name-123456.netlify.app
```

You can rename it to something nicer in:
**Site configuration → Site details → Change site name**
For example: `shastra-india.netlify.app`

---

## How the secure proxy works

```
Your Browser
    │
    │  POST /api/chat
    ▼
netlify.toml (redirect rule)
    │
    │  forwards to ↓
    ▼
netlify/functions/chat.js   ← runs on Netlify's servers
    │
    │  adds your ANTHROPIC_API_KEY (stored safely in Netlify)
    │  never sent to browser
    ▼
Anthropic Claude API
    │
    ▼
Verse returned in Sanskrit + Hindi + English ✓
```

---

## Custom Domain (Optional)

1. Buy a domain at Namecheap.com (~$10/year)
2. In Netlify → **Domain management** → **Add a domain**
3. Follow Netlify's DNS instructions (takes ~10 min)
4. Netlify adds free HTTPS automatically ✓

---

## Cost Estimate

| Item | Cost |
|------|------|
| Netlify hosting | Free |
| Custom domain | ~$10/year (optional) |
| Anthropic API per verse load | ~$0.003 |
| 1,000 verse loads | ~$3.00 |
