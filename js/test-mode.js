/** Enabled only from test.html — invincible player, enemies die in one hit. */
window.PICHASITOS_TEST_MODE = true;

const TestMode = {
  isActive() {
    return window.PICHASITOS_TEST_MODE === true;
  },
};
