# [Introductory Earth Science - 理系地学入門](http://localhost:4500)

This is a Next.js project for "Introductory Earth Science," a comprehensive online reference for science-based geoscience. The content is written in Markdown and statically generated for high performance. It uses KaTeX, a fast, high-quality mathematical formula rendering library, to render mathematical formulas on the server side to minimize latency, while using the Image component to automatically improve website performance and user experience. By placing the aside tag on the left and leaving the rest as the main text, the layout is neat and easy to read. This online reference stands out from the rest: Introductory Earth Science.

## Project Workflow

This project is designed to be developed locally and deployed automatically via Git. The primary workflow involves editing content, testing it on a local server, and then pushing the changes to GitHub to trigger a deployment on Cloudflare Pages.

### 1. Running the Development Server

To work on the site locally, you need to run the Next.js development server. This server provides features like Fast Refresh, which automatically updates the browser as you edit files.

Run the development server:
```bash
cd /d G:
cd G:\Mo\□ PERMANENT STORAGE\PROJECTS\geology_site
npm run dev
```

Open [http://localhost:4500](http://localhost:4500) in your browser to see the result. You can now start editing content files (e.g., in the `_contents` directory) or component files (e.g., `src/app/page.tsx`). The page will auto-update as you save your changes.

### 2. Building for Production and Deploying

The live site is updated automatically whenever new changes are pushed to the `main` branch on GitHub. The following steps describe the process for finalizing your changes and triggering a deployment.

#### Step 2.1: (Optional) Local Production Build
Before pushing to GitHub, you can verify that the project builds successfully for production on your local machine. This helps catch potential errors early.

```bash
npm run build
```
This command creates an optimized, production-ready version of your site in the `.next` or `out` directory. If this command completes without errors, your code is ready for deployment.

#### Step 2.2: Staging, Committing, and Pushing to GitHub
Once your changes are complete and tested, you need to commit them to Git and push them to the GitHub repository. This is the trigger for the live deployment.

```bash
git add .
git commit -m "Updated Pages"
git push origin main
```
After the `git push` command completes, Cloudflare Pages will automatically detect the new commit, build the project, and deploy the updated site.

### 3. Starting a Production Server (For Local Testing Only)

The `npm run start` command is generally **not needed** for this project's workflow, as deployment is handled by Cloudflare Pages.

However, if you want to test the production build (`npm run build`) on your local machine before deploying, you can use this command. It starts a local server that serves the optimized production files, mimicking how the live site would behave.

First, create a production build:
```bash
npm run build
```

Then, start the production server:
```bash
npm run start
```
Open [http://localhost:4500](http://localhost:4500) to view the production version of your site locally. This is useful for performance testing or final checks.