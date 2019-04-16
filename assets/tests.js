'use strict';

define("location-demo/tests/integration/components/region-show-test", ["ember-qunit"], function (_emberQunit) {
  "use strict";

  (0, _emberQunit.moduleForComponent)('region-show', 'Integration | Component | region show', {
    integration: true
  });
  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    this.render(Ember.HTMLBars.template({
      "id": "gJ1M5xUd",
      "block": "{\"symbols\":[],\"statements\":[[1,[23,\"region-show\"],false]],\"hasEval\":false}",
      "meta": {}
    }));
    assert.equal(this.$().text().trim(), ''); // Template block usage:

    this.render(Ember.HTMLBars.template({
      "id": "mDRcsdH7",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"region-show\",null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));
    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define("location-demo/tests/lint/app.lint-test", [], function () {
  "use strict";

  QUnit.module('ESLint | app');
  QUnit.test('app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'app.js should pass ESLint\n\n');
  });
  QUnit.test('components/region-show.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/region-show.js should pass ESLint\n\n');
  });
  QUnit.test('regions/city.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'regions/city.js should pass ESLint\n\n');
  });
  QUnit.test('regions/city_object.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'regions/city_object.js should pass ESLint\n\n');
  });
  QUnit.test('regions/country.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'regions/country.js should pass ESLint\n\n');
  });
  QUnit.test('regions/country_object.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'regions/country_object.js should pass ESLint\n\n');
  });
  QUnit.test('regions/province.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'regions/province.js should pass ESLint\n\n');
  });
  QUnit.test('regions/province_object.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'regions/province_object.js should pass ESLint\n\n');
  });
  QUnit.test('resolver.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'resolver.js should pass ESLint\n\n');
  });
  QUnit.test('router.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'router.js should pass ESLint\n\n');
  });
  QUnit.test('services/region.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'services/region.js should pass ESLint\n\n10:16 - Use import Service from \'@ember/service\'; instead of using Ember.Service (ember/new-module-imports)');
  });
});
define("location-demo/tests/lint/templates.template.lint-test", [], function () {
  "use strict";

  QUnit.module('TemplateLint');
  QUnit.test('location-demo/templates/application.hbs', function (assert) {
    assert.expect(1);
    assert.ok(false, 'location-demo/templates/application.hbs should pass TemplateLint.\n\nlocation-demo/templates/application.hbs\n  7:4  error  Incorrect indentation for `<div>` beginning at L7:C4. Expected `<div>` to be at an indentation of 2 but was found at 4.  block-indentation\n  8:8  error  Incorrect indentation for `<div>` beginning at L8:C8. Expected `<div>` to be at an indentation of 6 but was found at 8.  block-indentation\n  9:8  error  Incorrect indentation for `<div>` beginning at L9:C8. Expected `<div>` to be at an indentation of 6 but was found at 8.  block-indentation\n  10:8  error  Incorrect indentation for `<div>` beginning at L10:C8. Expected `<div>` to be at an indentation of 6 but was found at 8.  block-indentation\n  11:8  error  Incorrect indentation for `<div>` beginning at L11:C8. Expected `<div>` to be at an indentation of 6 but was found at 8.  block-indentation\n  15:8  error  Incorrect indentation for `<div>` beginning at L15:C8. Expected `<div>` to be at an indentation of 6 but was found at 8.  block-indentation\n  16:8  error  Incorrect indentation for `<div>` beginning at L16:C8. Expected `<div>` to be at an indentation of 6 but was found at 8.  block-indentation\n  17:8  error  Incorrect indentation for `<div>` beginning at L17:C8. Expected `<div>` to be at an indentation of 6 but was found at 8.  block-indentation\n  12:12  error  Incorrect indentation for `<a>` beginning at L12:C12. Expected `<a>` to be at an indentation of 10 but was found at 12.  block-indentation\n  13:12  error  Incorrect indentation for `<a>` beginning at L13:C12. Expected `<a>` to be at an indentation of 10 but was found at 12.  block-indentation\n  18:12  error  Incorrect indentation for `{{#region-show}}` beginning at L18:C12. Expected `{{#region-show}}` to be at an indentation of 10 but was found at 12.  block-indentation\n  23:4  error  Incorrect indentation for `<p>` beginning at L23:C4. Expected `<p>` to be at an indentation of 2 but was found at 4.  block-indentation\n  23:99  error  Incorrect indentation for `\n        Powered by ` beginning at L23:C99. Expected `\n        Powered by ` to be at an indentation of 6 but was found at 8.  block-indentation\n  23:7  error  elements cannot have inline styles  no-inline-styles\n');
  });
  QUnit.test('location-demo/templates/components/region-show.hbs', function (assert) {
    assert.expect(1);
    assert.ok(false, 'location-demo/templates/components/region-show.hbs should pass TemplateLint.\n\nlocation-demo/templates/components/region-show.hbs\n  3:4  error  Incorrect indentation for `<div>` beginning at L3:C4. Expected `<div>` to be at an indentation of 2 but was found at 4.  block-indentation\n  8:4  error  Incorrect indentation for `<p>` beginning at L8:C4. Expected `<p>` to be at an indentation of 2 but was found at 4.  block-indentation\n  13:4  error  Incorrect indentation for `<button>` beginning at L13:C4. Expected `<button>` to be at an indentation of 2 but was found at 4.  block-indentation\n  4:8  error  Incorrect indentation for `{{#ui-select}}` beginning at L4:C8. Expected `{{#ui-select}}` to be at an indentation of 6 but was found at 8.  block-indentation\n  5:8  error  Incorrect indentation for `{{#ui-select}}` beginning at L5:C8. Expected `{{#ui-select}}` to be at an indentation of 6 but was found at 8.  block-indentation\n  6:8  error  Incorrect indentation for `{{#ui-select}}` beginning at L6:C8. Expected `{{#ui-select}}` to be at an indentation of 6 but was found at 8.  block-indentation\n  9:8  error  Incorrect indentation for `{{province.name}}` beginning at L9:C8. Expected `{{province.name}}` to be at an indentation of 6 but was found at 8.  block-indentation\n  10:8  error  Incorrect indentation for `{{city.name}}` beginning at L10:C8. Expected `{{city.name}}` to be at an indentation of 6 but was found at 8.  block-indentation\n  11:8  error  Incorrect indentation for `{{area.name}}` beginning at L11:C8. Expected `{{area.name}}` to be at an indentation of 6 but was found at 8.  block-indentation\n');
  });
});
define("location-demo/tests/lint/tests.lint-test", [], function () {
  "use strict";

  QUnit.module('ESLint | tests');
  QUnit.test('integration/components/region-show-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/region-show-test.js should pass ESLint\n\n');
  });
  QUnit.test('test-helper.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'test-helper.js should pass ESLint\n\n');
  });
  QUnit.test('unit/services/region-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/services/region-test.js should pass ESLint\n\n');
  });
});
define("location-demo/tests/test-helper", ["location-demo/app", "location-demo/config/environment", "@ember/test-helpers", "ember-qunit"], function (_app, _environment, _testHelpers, _emberQunit) {
  "use strict";

  (0, _testHelpers.setApplication)(_app.default.create(_environment.default.APP));
  (0, _emberQunit.start)();
});
define("location-demo/tests/unit/services/region-test", ["ember-qunit"], function (_emberQunit) {
  "use strict";

  (0, _emberQunit.moduleFor)('service:region', 'Unit | Service | region', {// Specify the other units that are required for this test.
    // needs: ['service:foo']
  }); // Replace this with your real tests.

  (0, _emberQunit.test)('it exists', function (assert) {
    let service = this.subject();
    assert.ok(service);
  });
});
define('location-demo/config/environment', [], function() {
  var prefix = 'location-demo';
try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(decodeURIComponent(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

});

require('location-demo/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;
