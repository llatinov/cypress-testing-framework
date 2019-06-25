import { createCoverageMap } from 'istanbul-lib-coverage';
import { TEST_RESULT_FOLDER } from '../constants';

const map = createCoverageMap({});
const mergeCoverage = coverage => {
  if (coverage) {
    map.merge(coverage);
    return true;
  }
  return false;
};

Cypress.on('window:before:unload', event => {
  // eslint-disable-next-line no-underscore-dangle
  mergeCoverage(event.currentTarget.__coverage__);
});

after(() => {
  cy.window().then(win => {
    // eslint-disable-next-line no-underscore-dangle
    if (mergeCoverage(win.__coverage__)) {
      const fileName = win.Cypress.spec.name.replace(/(\/)/g, '_');
      cy.writeFile(`${TEST_RESULT_FOLDER}/${fileName}.out`, JSON.stringify(map));
    }
  });
});
