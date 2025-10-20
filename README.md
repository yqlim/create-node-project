# Create Bootstrap

Create a new Node.js project with opinionated bootstrap.

This project aims to provide a simplified way to set up a new Node.js project with a predefined structure and configuration.

Projects bootstrapped with this tool will always include:

- [TypeScript](https://github.com/microsoft/TypeScript) support
- [ESLint](https://github.com/eslint/eslint) for code linting
- [Prettier](https://github.com/prettier/prettier) for code formatting
- [husky](https://github.com/typicode/husky) for Git hooks
- [lint-staged](https://github.com/lint-staged/lint-staged) for staged file linting
- [commitlint](https://github.com/conventional-changelog/commitlint) for commit message linting

This project will not include the official bootstraps provided by respective frameworks or tools. Instead, it focuses on providing alternative bootstraps that are generically opinionated and can be adapted to various use cases.

## Quick Start

Quickly create a new Node.js project using one of the following commands:

```sh
npm create bootstrap@latest

pnpm create bootstrap@latest
```

The command will prompt you for details required to set up your project.

Alternatively, you can provide the details directly:

```sh
npm create bootstrap@latest -- $PACKAGE_DIRECTORY \
  --description $PACKAGE_DESCRIPTION \
  --name $PACKAGE_NAME \
  --template $TEMPLATE_NAME

pnpm create bootstrap@latest $PACKAGE_DIRECTORY \
  --description $PACKAGE_DESCRIPTION \
  --name $PACKAGE_NAME \
  --template $TEMPLATE_NAME
```

To see all available options, run:

```sh
npm create bootstrap@latest -- --help

pnpm create bootstrap@latest --help
```

> [!NOTE]
> This project is still in active development, but is stable enough for use since it is just a bootstrapping tool.
>
> If you use it in your CI/CD pipelines (which I don't think this project has any use case for), you may not want to use the `latest` tag at this point.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.

### Creating new template

To create a new template, add a new folder under the `templates` directory. The folder name will be used as the template name.

All templates must include the six tools mentioned above. You can refer to the existing templates for reference.
