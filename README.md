# sandeep-jr.github.io

React + MUI portfolio powered by Vite, with Node managed via Bazelisk (no local Node install required).

## Quick start

```bash
# Install dependencies using the Bazel-managed Node toolchain
bazelisk run @nodejs//:npm -- install

# Start the dev server
bazelisk run @nodejs//:npm -- run dev
```

## Build for production

```bash
bazelisk run @nodejs//:npm -- run build
```

The output will be in `dist/`.

## Deploy to GitHub Pages

1. Create a GitHub repo named `sandeep-jr.github.io`.
2. Push this project to the `main` branch.
3. In GitHub, open **Settings → Pages** and ensure the source is set to **GitHub Actions**.

A workflow is already included at `.github/workflows/deploy.yml` to build and deploy on each push to `main`.

## Customize

Edit `src/App.jsx` to swap in your real projects, links, and contact details.
