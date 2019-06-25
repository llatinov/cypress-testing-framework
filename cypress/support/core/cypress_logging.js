import { inspect } from 'util';
import moment from 'moment';
import { TEST_RESULT_FOLDER } from '../constants';

const loggedCommands = new Set();
const loggedResponses = new Set();
const seenTests = new Map();

const getFilePath = filename => `${TEST_RESULT_FOLDER}/${filename}`;
const getSpecName = () => window.location.pathname.replace('/__cypress/iframes/integration/', '');
const removeQuotes = str => str.replace(/"/g, '').replace(/\\n /g, '');
const timeToSeconds = time => Number(time / 1000).toFixed(2);
const getSuiteName = test => test.parent && test.parent.title;
const datetime = () => moment().toISOString();

const initCommands = () => {
  loggedCommands.clear();
  loggedResponses.clear();
};

const shouldCaptureResponse = url => {
  let result = true;
  const exclude = Cypress.config('captureResponsesExcludePaths').split(',');
  if (exclude.length > 0) {
    const excludeRegex = exclude.map(item => new RegExp(item.replace(/[*]/g, '(.*?)'), 'g'));
    excludeRegex.forEach(reg => {
      if (url.match(reg)) {
        result = false;
      }
    });
  }
  return result;
};

const stringify = obj =>
  removeQuotes(
    JSON.stringify(obj, (key, val) => {
      if (typeof val === 'object') {
        const result = {};
        // eslint-disable-next-line no-restricted-syntax
        for (const prop in val) {
          if (
            typeof val[prop] !== 'object' &&
            typeof val[prop] !== 'function' &&
            val[prop] != null &&
            prop !== 'xhrUrl'
          ) {
            result[prop] = val[prop];
          }
        }
        return inspect(result);
      }
      return inspect(val);
    })
  );

const startLogging = () => {
  Cypress.on('command:end', ({ attributes }) => {
    const str = `${datetime()} ${attributes.name} ${attributes.args.map(stringify).join(' ')}`;
    if (Cypress._.isPlainObject(attributes.subject) || attributes.args.length === 0) {
      try {
        const s = stringify(attributes.subject);
        loggedCommands.add(`${str} ${s}`);
      } catch (e) {
        cy.log(`could not convert subject '${attributes.subject}' for command ${attributes}`);
        loggedCommands.add(str);
      }
    } else {
      loggedCommands.add(str);
    }
  });
  Cypress.on('log:changed', ({ consoleProps }) => {
    if (consoleProps.Event === 'xhr' && Cypress.config('enableCaptureResponses')) {
      const xhr = consoleProps.XHR;
      const body = consoleProps.Request.body
        ? JSON.stringify(consoleProps.Request.body)
        : undefined;
      if (xhr.response !== '' && shouldCaptureResponse(xhr.url)) {
        const data = {
          datetime: datetime(),
          method: xhr.method,
          path: xhr.url,
          request: body,
          response: xhr.response,
        };
        loggedResponses.add(data);
      }
    }
  });
};

function init() {
  seenTests.clear();
  cy.task('cleanUpResults', getFilePath(getSpecName()));
}

function writeTestFailures() {
  if (this.currentTest.state !== 'failed') {
    return;
  }

  const specName = getSpecName();
  const suiteName = getSuiteName(this.currentTest);
  const testName = this.currentTest.title;
  const duration = this.currentTest.duration;
  const testError = this.currentTest.err.message;
  const testCommands = Array.from(loggedCommands);
  const responses = Array.from(loggedResponses);

  if (seenTests.get(testName) !== undefined) {
    cy.log(`Test name should be unique, '${testName}' already exists!`);
    return;
  }
  seenTests.set(testName, testError);

  const info = {
    specName,
    suiteName,
    testName,
    duration: `${timeToSeconds(duration)} seconds`,
    testError,
    testCommands,
    responses,
  };
  const content = `${JSON.stringify(info, null, 2)}\n`;
  const filename = `${specName}/${suiteName} -- ${testName} (failed).json`;
  const filepath = getFilePath(filename);
  const output = `Saved failed test information to '${filepath}'`;
  cy.writeFile(filepath, content).log(output);

  // Copy screenshot
  const screenshotFilename = filename.replace('json', 'png');
  cy.task('copyFile', {
    from: `cypress/screenshots/${screenshotFilename}`,
    to: getFilePath(screenshotFilename),
  });
}

function generateJunitData(suites) {
  const resultData = [];

  suites.forEach(suite => {
    const suiteData = {};
    suiteData.name = suite.title;
    suiteData.time = 0;
    suiteData.tests = 0;
    suiteData.failed = 0;
    suiteData.skipped = 0;
    suiteData.testData = [];

    suite.tests.forEach(test => {
      const testData = {};
      const testName = test.title;
      const time = test.duration !== undefined ? test.duration : 0;

      testData.name = testName;
      testData.time = time;

      suiteData.time += time;
      suiteData.tests += 1;

      if (test.state === 'failed') {
        suiteData.failed += 1;
        testData.failed = true;
        const error =
          seenTests.get(testName) !== undefined
            ? seenTests.get(testName)
            : `Error in '${test.hookName}' hook: ${test.err.message}`;
        testData.error = error;
      } else if (test.state === 'pending') {
        suiteData.skipped += 1;
        testData.skipped = true;
      }
      suiteData.testData.push(testData);
    });

    resultData.push(suiteData);
  });

  return resultData;
}

// https://github.com/junit-team/junit5/blob/master/platform-tests/src/test/resources/jenkins-junit.xsd
// https://llg.cubic.org/docs/junit/
function writeJunitReport() {
  const data = generateJunitData(this.currentTest.parent.parent.suites);

  const specName = getSpecName();
  const totalTime = data.reduce((actual, current) => actual + current.time, 0);
  const totalTimeString = timeToSeconds(totalTime);
  const totalTests = data.reduce((actual, current) => actual + current.tests, 0);
  const failedSuites = data.reduce((actual, current) => actual + current.failed, 0);

  let content = '<?xml version="1.0" encoding="UTF-8"?>\n';
  content += `<testsuites name="Cypress Tests" `;
  content += `time="${totalTimeString}" `;
  content += `tests="${totalTests}" `;
  content += `failures="${failedSuites}">\n`;

  data.forEach(suite => {
    content += `\t<testsuite name="${suite.name}" `;
    content += `timestamp="${new Date().toISOString()}" `;
    content += `tests="${suite.tests}" `;
    content += `failures="${suite.failed}" `;
    content += `skipped="${suite.skipped}" `;
    content += `time="${timeToSeconds(suite.time)}">\n`;

    suite.testData.forEach(test => {
      content += `\t\t<testcase name="${test.name}" `;
      content += `time="${timeToSeconds(test.time)}" `;
      content += `classname="${specName}">\n`;
      if (test.failed) {
        content += `\t\t\t<failure><![CDATA[${test.error}]]></failure>\n`;
      }
      if (test.skipped) {
        content += '\t\t\t<skipped />\n';
      }
      content += '\t\t</testcase>\n';
    });

    content += '\t</testsuite>\n';
  });
  content += '</testsuites>';

  const filename = getSpecName().replace(/\//g, '_');
  const filepath = `${getFilePath(filename)}.xml`;
  cy.writeFile(filepath, content).log(`JUnit file saved to '${filepath}'`);

  // If no tests are run then this could be problem in 'before all' hook
  if (seenTests.size === 0 && this.currentTest.err) {
    const error = this.currentTest.err;
    const errorFilename = `${getSpecName()}/${error.name}.txt`;
    const erroFilepath = getFilePath(errorFilename);
    cy.writeFile(erroFilepath, error.message);
  }
}

startLogging();
before(init);
beforeEach(initCommands);
afterEach(writeTestFailures);
after(writeJunitReport);
