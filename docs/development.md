<details open="open">
  <summary>Table of Contents</summary>

- [Workflow](#workflow)
- [Commit Message Format](#commit-message-format)

</details>

## Workflow

ALl the work should be done in separate branches and be merged in `main` branch by pull requests.

1. Create your Branch (`git checkout -b POLARIS-1-Awesome-feature`)
2. Commit your Changes (`git commit -m 'Add some awesome feature'`)
3. Push to the Branch (`git push origin POLARIS-1-Awesome-feature`)
4. Open a Pull Request against the `main` branch
5. Make sure all the build checks are passed
6. After the pull request is reviewed and approved, merge it

## Commit Message Format

_This specification is inspired by and supersedes the [Angular commit message format](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#commit)._

This format leads to **easier to read commit history**.

Each commit message consists of a **header**, a **body**.

```
<header>
<BLANK LINE>
<body>
```

The `header` is mandatory and must conform to the [Commit Message Header](#commit-header) format.

The `body` is optional and must conform to the [Commit Message Body](#commit-body) format.

#### <a name="commit-header"></a>Commit Message Header

```
<type>(<scope>): <short summary>
  │       │             │
  │       │             └─⫸ Summary in present tense. Not capitalized. No period at the end.
  │       │
  │       └─⫸ Commit Scope: animations|bazel|benchpress|common|compiler|compiler-cli|core|
  │                          elements|forms|http|language-service|localize|platform-browser|
  │                          platform-browser-dynamic|platform-server|router|service-worker|
  │                          upgrade|zone.js|packaging|changelog|dev-infra|docs-infra|migrations|
  │                          ngcc|ve
  │
  └─⫸ Commit Type: build|ci|docs|feat|fix|perf|refactor|test
```

The `<type>` and `<summary>` fields are mandatory, the `(<scope>)` field is optional.

##### Type

Must be one of the following:

- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to our CI configuration files and scripts (example scopes: Circle, BrowserStack, SauceLabs)
- **docs**: Documentation only changes
- **feat**: A new feature
- **fix**: A bug fix
- **perf**: A code change that improves performance
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **test**: Adding missing tests or correcting existing tests

##### Scope

The scope should be the name of the package affected (as perceived by the person reading the changelog generated from commit messages).

The following is the list of supported scopes:

- `polaris-angular`
- `polaris-api`
- `prisma`

##### Summary

Use the summary field to provide a succinct description of the change:

- use the imperative, present tense: "change" not "changed" nor "changes"
- don't capitalize the first letter
- no dot (.) at the end

#### <a name="commit-body"></a>Commit Message Body

Explain the motivation for the change in the commit message body. This commit message should explain _why_ you are making the change.
You can include a comparison of the previous behavior with the new behavior in order to illustrate the impact of the change.

TODO
These will be elaborated when ready.

- Testing in detail
- Code coverage
- Development setup with docker
- Development setup without docker
- CI/CD pipeline
