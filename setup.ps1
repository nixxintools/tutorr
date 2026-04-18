# tutorr — one-time setup script
# Run this from C:\Dev\tutorr in PowerShell

Write-Host "Setting up tutorr..." -ForegroundColor Cyan

# 1. Install dependencies
Write-Host "`n[1/4] Installing npm packages..." -ForegroundColor Yellow
npm install

# 2. Point git to your GitHub and push
# NOTE: Create the repo at https://github.com/new first (name: tutorr, keep it empty)
Write-Host "`n[2/4] Pointing git to your GitHub and pushing..." -ForegroundColor Yellow
git remote remove origin
git remote add origin https://github.com/nixxintools/tutorr.git
git branch -M main
git add .
git commit -m "Initial commit: tutorr AI tutoring app"
git push -u origin main

# 3. Deploy to Vercel (requires Vercel CLI: npm i -g vercel)
Write-Host "`n[3/4] Deploying to Vercel as 'tutorr'..." -ForegroundColor Yellow
vercel --name tutorr --yes

Write-Host "`n[4/4] Done! Next steps:" -ForegroundColor Green
Write-Host "  - Fill in .env.local with your Supabase URL, anon key, and an AI API key"
Write-Host "  - Run the Supabase schema: paste supabase/schema.sql into your Supabase SQL editor"
Write-Host "  - Add the same env vars in Vercel dashboard > tutorr > Settings > Environment Variables"
Write-Host "  - Then run: vercel --prod"
Write-Host "`nLocal dev: npm run dev  (http://localhost:3000)"
