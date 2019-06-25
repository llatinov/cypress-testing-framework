// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************
// Import commands.js using ES2015 syntax:
import './commands';
import './core/cypress_promisify';
import './core/cypress_logging';
import './core/cypress_code_coverage';
import './commands_navigation';
import './commands_api';
import './commands_assert';

// Alternatively you can use CommonJS syntax:
// require('./commands')
