const fs = require('fs');
const junitMerge = require('junit-report-merger');
const spawn = require('child_process').spawn;
const xml2json = require('xml-js').xml2json;
const createCoverageMap = require('istanbul-lib-coverage').createCoverageMap;
const helpers = require('../../plugins/helpers');
const TEST_RESULT_FOLDER = require('../constants').TEST_RESULT_FOLDER;
const DOCKER_CONTAINER_PATH = require('../constants').DOCKER_CONTAINER_PATH;

const mergedFile = `${TEST_RESULT_FOLDER}/merged-test-results.xml`;
const resultsFile = `${TEST_RESULT_FOLDER}/result.html`;
const failedFile = `${TEST_RESULT_FOLDER}/failed.txt`;
const coverageFilePath = '.nyc_output/out.json';

const cleanUp = () => {
  helpers.deleteFile(mergedFile);
  helpers.deleteFile(resultsFile);
  helpers.deleteFile(failedFile);
  helpers.deleteFile(coverageFilePath);
};

const readFileTypes = type => {
  const results = new Set();

  fs.readdirSync(TEST_RESULT_FOLDER).forEach(fileName => {
    if (fileName.endsWith(type)) {
      results.add(`${TEST_RESULT_FOLDER}/${fileName}`);
    }
  });

  return Array.from(results);
};

const prepareHtmlReport = () => {
  if (fs.existsSync(mergedFile)) {
    spawn('xunit-viewer', [`--results=${mergedFile}`, `--output=${resultsFile}`]);
  }
};

const reportFailedTests = () => {
  const failedTests = new Set();

  const file = fs.readFileSync(mergedFile, 'utf8');
  const resultRaw = xml2json(file);
  const result = JSON.parse(resultRaw);
  const testsuites = result.elements;
  if (testsuites[0].attributes.failures === 0) {
    return;
  }

  const testsuite = testsuites[0].elements || [];
  testsuite.forEach(suite => {
    if (suite.attributes.failures > 0) {
      const testcase = suite.elements;
      testcase.forEach(tcase => {
        if (tcase.elements && tcase.elements[0].name === 'failure') {
          failedTests.add(tcase.attributes.classname);
        }
      });
    }
  });

  if (failedTests.size > 0) {
    helpers.writeFile(failedFile, Array.from(failedTests).join('\n'));
  }
};

/**
 * Change paths produced by Istanbul code coverage.
 * Paths are absolute in the container and do not match the local paths.
 * Make code coverage path relative resolves them into the report.
 */
const fixCodeCoveragePaths = content => {
  const appRoot = process.env.PWD;
  const contentObj = JSON.parse(content);
  Object.keys(contentObj).forEach(key => {
    if (contentObj[key].path.startsWith(DOCKER_CONTAINER_PATH)) {
      contentObj[key].path = contentObj[key].path.replace(DOCKER_CONTAINER_PATH, appRoot);
      const newSources = [];
      contentObj[key].inputSourceMap.sources.forEach(value => {
        newSources.push(value.replace(DOCKER_CONTAINER_PATH, appRoot));
      });
      contentObj[key].inputSourceMap.sources = newSources;
    }
  });
  return contentObj;
};

const prepareCodeCoverage = () => {
  const results = readFileTypes('out');
  const map = createCoverageMap({});

  if (results.length === 0) {
    return;
  }

  results.forEach(filePath => {
    const content = fs.readFileSync(filePath, 'utf8');
    const contentObj = fixCodeCoveragePaths(content);
    map.merge(createCoverageMap(contentObj));
  });

  helpers.writeFile(coverageFilePath, JSON.stringify(map));

  results.forEach(filePath => {
    helpers.deleteFile(filePath);
  });

  if (fs.existsSync(coverageFilePath)) {
    spawn('nyc', [`report`, `--reporter=html`]);
  }
};

const start = () => {
  if (!fs.existsSync(TEST_RESULT_FOLDER)) {
    return;
  }

  cleanUp();

  const results = readFileTypes('xml');
  junitMerge.mergeFiles(mergedFile, results, () => {
    prepareHtmlReport();

    reportFailedTests();

    prepareCodeCoverage();
  });
};

start();
