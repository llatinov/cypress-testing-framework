// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const tasks = require('./tasks');

const getBooleanValue = (property, defaultValue) => {
  const value = process.env[property] || defaultValue;
  return `${value}`.toLowerCase().trim() === 'true';
};

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  on('task', {
    cleanUpResults: tasks.cleanUpResults,
    copyFile: tasks.copyFile,
  });

  // `config` is the resolved Cypress config
  const copyConfig = config;
  copyConfig.watchForFileChanges = false;
  copyConfig.baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3030';
  copyConfig.apiUrl = process.env.TEST_API_URL || 'http://localhost:9000';
  copyConfig.enableCodeCoverage = getBooleanValue('TEST_CODE_COVERAGE', false);
  copyConfig.enableCaptureResponses = getBooleanValue('TEST_CAPTURE_RESPONSES', true);
  copyConfig.captureResponsesExcludePaths =
    process.env.TEST_CAPTURE_RESPONSES_EXCLUDE_PATHS || '*/mini-profiler-resources/*';

  return copyConfig;
};
