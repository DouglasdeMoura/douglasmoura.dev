---
title: Use GitHub actions to publish your package on NPM
slug: use-github-actions-to-publish-your-package-on-npm
locale: en-US
created: 2022-10-04 15:00:00.000Z
updated: 2022-12-29 14:51:36.616Z
tags:
  - javascript
  - typescript
  - npm
cover: ./cover.jpg
---

Recently, I created a package with the [ESLint](https://eslint.org) settings I like to use in my React projects, as I was tired of always having to configure it when I start new React projects. Publishing a NPM package is just a matter of running `npm publish` on the directory of your package (considering, of course, that you already have an NPM account and is authenticated on your terminal). But I wanted to automatize this publishing everytime I created a new release.

In order to do that, I used the following GitHub Action:

```yaml
# File: .github/workflows/npm-publish.yml

# This workflow will publish a package to NPM when a release is created
# For more information see: https://help.github.com/actions/language-and-framework-guides/publishing-nodejs-packages

name: Publish Package to npmjs

on:
  release:
    types: [created]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 16
          registry-url: https://registry.npmjs.org/
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{secrets.NODE_AUTH_TOKEN}}
```

If you read the YAML file above (that you should put on the `.github/workflows/npm-publish.yml` directory of your git repository), you should have noted that the environment variable `NODE_AUTH_TOKEN` should be defined. Create a new automation access token on the control panel of NPM:

1. Access your NPM account and click in "Access tokens":
   ![Access tokens on NPM](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/hddbdiev3xhhrl0s09km.png)

2. Name your new access token and select the "Automation" type for it:

![Creating access token on NPM](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/4oect8iqd17igcbnrrg1.png)

3. Go to your GitHub repository, click in "Settings > Secrets > Actions > New repository secret", name it as NODE_AUTH_TOKEN and paste the access token you just got from NPM:

![Create a new secret on the GitHub repository](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/wv7pw3j8elyjeoaeehif.png)

4. Create a new release for your package. This should trigger our GitHub Action and publish to NPM.

![Creating a new release on GitHub](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/31fsgle783ujl75stld1.png)
