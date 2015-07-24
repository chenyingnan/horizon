/*
 * (c) Copyright 2015 Hewlett-Packard Development Company, L.P.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function () {
  "use strict";

  describe('st-magic-search directive', function () {
    var $element, $scope, $timeout;

    beforeEach(module('templates'));
    beforeEach(module('smart-table'));
    beforeEach(module('horizon.framework.widgets'));
    beforeEach(module('MagicSearch'));

    beforeEach(inject(function ($injector) {
      var $compile = $injector.get('$compile');
      $scope = $injector.get('$rootScope').$new();
      $timeout = $injector.get('$timeout');

      $scope.rows = [
        { name: 'instance one', status: 'active', flavor: 'm1.tiny' },
        { name: 'instance two', status: 'active', flavor: 'm1.small' },
        { name: 'instance three', status: 'shutdown', flavor: 'm1.tiny' },
        { name: 'instance four', status: 'shutdown', flavor: 'm1.small' },
        { name: 'instance five', status: 'error', flavor: 'm1.tiny' },
        { name: 'instance six', status: 'error', flavor: 'm1.small' }
      ];

      $scope.filterStrings = {
        cancel: gettext('Cancel'),
        prompt: gettext('Prompt'),
        remove: gettext('Remove'),
        text: gettext('Text')
      };

      $scope.filterFacets = [
        {
          name: 'name',
          label: gettext('Name'),
          singleton: true
        },
        {
          name: 'status',
          label: gettext('Status'),
          options: [
            { key: 'active', label: gettext('Active') },
            { key: 'shutdown', label: gettext('Shutdown') },
            { key: 'error', label: gettext('Error') }
          ]
        },
        {
          name: 'flavor',
          label: gettext('Flavor'),
          singleton: true,
          options: [
            { key: 'm1.tiny', label: gettext('m1.tiny') },
            { key: 'm1.small', label: gettext('m1.small') }
          ]
        }
      ];

      /* eslint-disable angular/ng_window_service */
      var msTemplate = window.STATIC_URL + 'framework/widgets/magic-search/magic-search.html';
      /* eslint-enable angular/ng_window_service */
      var stMagicSearch =
        '<st-magic-search>' +
        '  <magic-search ' +
        '    template="' + msTemplate + '"' +
        '    strings="filterStrings" ' +
        '    facets="{{ filterFacets }}">' +
        '  </magic-search>' +
        '</st-magic-search>';
      var markup = '<table st-table="rows">' +
                   '<thead>' +
                   ' <tr>' +
                   '   <th>' + stMagicSearch + '</th>' +
                   ' </tr>' +
                   '</thead>' +
                   '<tbody>' +
                   '  <tr ng-repeat="row in rows">' +
                   '    <td>{{ row.name }}</td>' +
                   '  </tr>' +
                   '</tbody>' +
                   '</table>';

      $element = $compile(angular.element(markup))($scope);

      $scope.$apply();
    }));

    it('should filter table to two rows if text searching with "active"', function () {
      $scope.$broadcast('textSearch', 'active');
      $timeout.flush();
      expect($element.find('tbody tr').length).toBe(2);
    });

    it('should filter table to two rows if facet with static === "shutdown"', function () {
      $scope.$broadcast('searchUpdated', 'status=shutdown');
      $timeout.flush();
      expect($element.find('tbody tr').length).toBe(2);
    });
  });
})();