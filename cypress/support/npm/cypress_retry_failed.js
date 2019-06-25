const fs = require('fs');
const xml2json = require('xml-js').xml2json;
const spawn = require('child_process').spawn;
const TEST_RESULT_FOLDER = require('../constants').TEST_RESULT_FOLDER;
const TEST_MAIN_FOLDER = require('../constants').TEST_MAIN_FOLDER;

const outputFile = `${TEST_RESULT_FOLDER}/retry-output.txt`;
let output = '';

const readFailedTests = () => {
  const testsToRetry = new Set();

  fs.readdirSync(TEST_RESULT_FOLDER).forEach(fileName => {
    if (fileName.endsWith('xml')) {
      const file = fs.readFileSync(`${TEST_RESULT_FOLDER}/${fileName}`, 'utf8');
      const resultRaw = xml2json(file);
      const result = JSON.parse(resultRaw);
      const testsuites = result.elements;
      if (testsuites[0].attributes.failures > 0) {
        const testsuite = testsuites[0].elements;
        testsuite.forEach(suite => {
          if (suite.attributes.failures > 0) {
            const testcase = suite.elements;
            testcase.forEach(tcase => {
              if (tcase.elements && tcase.elements[0].name === 'failure') {
                testsToRetry.add(tcase.attributes.classname);
              }
            });
          }
        });
      }
    }
  });

  return testsToRetry;
};

const flattenTestNames = tests => {
  const result = Array.from(tests).map(t => `${TEST_MAIN_FOLDER}/${t}`);
  return result.join(',');
};

const formatOutput = data => {
  const str = data.toString();
  const lines = str.split(/(\r?\n)/g);
  return lines.join('');
};

const rerunTests = testToRerun => {
  const process = spawn('yarn', ['cypress:run', '--', `--spec=${testToRerun}`]);

  process.stdout.setEncoding('utf8');
  process.stdout.on('data', data => {
    console.log(data);
    output += formatOutput(data);
  });

  process.stderr.setEncoding('utf8');
  process.stderr.on('data', data => {
    console.log(data);
    output += formatOutput(data);
  });

  process.on('close', code => {
    fs.writeFileSync(outputFile, `process exit with code: ${code}\n${output}`, { flag: 'a' });
  });
};

const start = () => {
  if (!fs.existsSync(TEST_RESULT_FOLDER)) {
    return;
  }

  const testsToRetry = readFailedTests();
  const testsToRun = flattenTestNames(testsToRetry);

  if (testsToRun.length > 0) {
    fs.writeFileSync(outputFile, `Tests to rerun: ${testsToRun}`);
    rerunTests(testsToRun);
  }
};

start();
