const { expo } = require("./app.json");

function normalizeBaseUrl(baseUrl) {
  if (!baseUrl || baseUrl === "/") {
    return "";
  }

  return baseUrl.startsWith("/") ? baseUrl : `/${baseUrl}`;
}

function getGitHubPagesBaseUrl() {
  const explicitBaseUrl = process.env.EXPO_PUBLIC_BASE_URL?.trim();

  if (explicitBaseUrl) {
    return normalizeBaseUrl(explicitBaseUrl);
  }

  const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1];

  if (!repositoryName || repositoryName.endsWith(".github.io")) {
    return "";
  }

  return `/${repositoryName}`;
}

module.exports = ({ config }) => ({
  ...config,
  ...expo,
  experiments: {
    ...config.experiments,
    ...expo.experiments,
    baseUrl: getGitHubPagesBaseUrl(),
  },
});
