# Contributing

Hey hey! Many thanks for considering to contribute to this project. ✌️

We welcome any type of contribution, not only code. You can help by:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Improving documentation

## Issue tracking

We use GitHub issues to track public bugs, feature requests and suggestions. [Open a new issue.](https://github.com/zeplin/microsoft-teams-app/issues/new)

☝️ *Please make sure to remove or mask any private/sensitive information before an issue here.*

For each bug report, please try to include the following information:

- A quick summary and/or background
- What you expected would happen
- What actually happens
- Steps to reproduce
  - Be specific
  - Share sample text output/screenshot/recording if possible
  
## Getting started
This app is written in [TypeScript](https://www.typescriptlang.org/) and runs on [Node.js](https://nodejs.org). Redis and MongoDB are required to run the app but, no worries, there's a docker configuration to start them up in your development environment. 

Assuming you have Node.js v12+ and Docker installed on your system and you've cloned the repository, you can start with setting up the development environment.

You can verify that Docker is running by running `docker run hello-world` in your terminal. This will test your Docker installation by running the [hello-world](https://hub.docker.com/_/hello-world/) image. If you hit any issues, you can get help from [this page](https://docs.docker.com/get-started/).

First, install the dependencies and spin up services (Redis and MongoDB) by running:
```
$ npm run dev:bootstrap
```

You can verify the environment is setup properly by running:
```
$ npm test
```

Once you're done with bootstrapping, the next step is to run the app locally. In order to run the app on your development environment, you will need:
 - Zeplin app
 - Office 365 connector
 
☝️ *For both your Zeplin app and Microsoft Teams connector, you will need a publicly available URL. [ngrok](https://ngrok.com/) (or any similar tool) helps a lot by tunneling traffic targeting a public URL to your development environment.*

### Configuring a Zeplin app
You can create a Zeplin app in your profile page under the [Developer](https://app.zeplin.io/profile/developer) tab:
   - **Redirect URI**: `https://DOMAIN/zeplin/auth/end` where `DOMAIN` is the domain of your publicly accessible URL (e.g. `balloons.ngrok.io`).
![](https://user-images.githubusercontent.com/721036/95139896-67ff5000-0722-11eb-86ad-d760936be2fe.png)

Please note down the client id and secret of the app, you will need them later.
![](https://user-images.githubusercontent.com/721036/95140586-18218880-0724-11eb-85db-230e22ef76f2.png)

### Configuring an Office 365 connector
Office 365 Connectors allow you to create a customized configuration page for your app to create incoming webhooks in Microsoft Teams. Microsoft Teams app use these incoming webhooks to post messages to the channels. 

You can create a connector via [Connectors Developer Dashboard](https://aka.ms/ConnectorsDashboard). Make sure you set the following parameters correctly:
   - **Configuration page for your Connector**: `https://DOMAIN/`
   - **Valid domains**: Add `DOMAIN` to the list of valid domains for this connector

![](https://user-images.githubusercontent.com/721036/95139905-6c2b6d80-0722-11eb-960b-79b52a286cd0.png)
Please note down the ID of the connector, you will use it in the next step.

You can visit Microsoft Teams' developer platform [docs](https://docs.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/connectors-creating) for more details.

### Running the app locally
With a Zeplin app and an Office 365 Connector, you can follow the steps below to run the app locally now:  

1. Run `npm run dev:tunnel` to create a tunnel to localhost (i.e., `balloons.ngrok.io -> localhost` where `balloons.ngrok.io` is `DOMAIN`)
2. Create the `.env` file by running: `cp .env.example .env`
3. Set the environment variables in the `.env` file.
     - **NEXT_PRIVATE_BASE_URL**: `https://DOMAIN`
     - **NEXT_PRIVATE_DOMAIN**: `DOMAIN`
     - **NEXT_PRIVATE_ZEPLIN_CLIENT_ID**: Client id of your Zeplin app.
     - **NEXT_PRIVATE_ZEPLIN_CLIENT_ID**: Client secret of your Zeplin app.
     - **NEXT_PRIVATE_CONNECTOR_ID**: The connector ID that you get in the previous step.
     - **NEXT_PRIVATE_APPLICATION_ID**: A UUID (or GUID) generated for your application.
4. Run `npm run dev` to start the application server locally. 
4. Next, run `npm run build:package` to create a zip package for Microsoft Teams.
5. Upload the `dist/package.zip` package to your Microsoft Teams organization.

Now, you can add the app to the Microsoft Teams channels to configure Zeplin connectors.

## Your first contribution

We use [GitHub Flow](https://guides.github.com/introduction/flow/index.html), all code changes happen through pull requests.

- [Fork](https://github.com/zeplin/microsoft-teams-app/fork) the repository
- Make sure the tests pass on your machine: `npm test`
- Create a new branch from `main`
- Make your changes, add tests if necessary and make sure the tests still pass
- Make sure your code lints by running `npm run lint`.
- If you've changed APIs, update the documentation.
- Ensure the test suite passes by running `npm test`.
- Make sure your code lints by running `npm run lint`.
  - We use [ESLint](https://eslint.org), [husky](https://github.com/typicode/husky) is configured to run `npm run lint` as a pre-commit hook for convenience.
- Pus to your fork and [submit a pull request](https://github.com/zeplin/microsoft-teams-app/compare).

## License

By contributing, you agree that your contributions will be licensed under its [MIT License](http://choosealicense.com/licenses/mit/).

## References

This document was adapted from an open source contribution document gist shared by [braindk](https://gist.github.com/briandk/3d2e8b3ec8daf5a27a62).
