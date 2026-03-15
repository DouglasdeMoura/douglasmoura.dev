---
title: How to push an empty commit on Git?
slug: how-to-push-an-empty-commit-on-git
locale: en-US
created: 2023-01-13 21:03:48.079Z
updated: 2023-01-13 21:03:48.079Z
tags:
  - Git
cover: ./cover.jpg
---

Have you ever had to run a [CI/CD pipeline](https://www.redhat.com/pt-br/topics/devops/what-cicd-pipeline) that is triggered by a commit, when
there is no code changes to be commited?

Well, just use the command below:

```bash
git commit --allow-empty -m "ci: trigger pipeline with an empty commit"
```

And then, just push the commit to the remote repository:

```bash
git push
```

That's it!
