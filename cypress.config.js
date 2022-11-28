const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    viewportHeight: 1200,
    viewportWidth: 1280,
    // baseUrl: 'https://www.pantarhei.sk',
  },
});
