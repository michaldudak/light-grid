# Changelog

## v1.0.0 RC1
This release has been tested with Angular 1.6.5.

### Breaking changes
* Extracted `lgPageSizeOptions` directive from `lgPager`
* `lgView` cannot span across multiple elements anymore
* Changed the default view name from "read" to "default"

### New features
* Removed jQuery dependency
* ServerDataProvider methods return promises
* Added success and error handlers to ServerDataProvider

### Bug fixes
* Rewritten lgView to work with Angular 1.5 and 1.6
* View model is regenerated every time a view is changed

## v0.3.2

* Fixed improper label in pager

## v0.3.1

* Added bower.json and build artifacts

## v0.3.0

### Breaking changes
* Removed the `lgColumn`, `lgColumnTemplates` and `lgHeaderView` directives
* Added the `lgRow` directive instead
* Restricted the `lgGrid` directive to an attribute
* Replaced the `rowData`, `rowController`, `view` and `viewModel` scope properties with a `row` object containing
  `data`, `controller`, `view` and `viewModel` fields
* Removed the `lgSortableColumn`, `lgEditableColumn` and `lgBoundColumn` template directives

### New features
* ng-repeat - like properties ($index, $odd, $even, etc.) now available in row scope
* `lgView` now can span across multiple elements (with `ng-view-start` and `ng-view-end`)
* Added a `grid` object to grid and row scopes containing `data` and `controller` fields
* The grid can be built on an arbitrary HTML element, not just a table

Thanks to these changes, it was possible to reduce the size of the script significantly (from 15 kB to 12 kB minified).

## v0.2.0

### Breaking changes
* Renamed the `lightGrid` directive to `lgGrid`
* Renamed the `persistData` directive to `lgPersistData`
* Renamed the `switchView` directive to `lgSwitchView`
* Restricted `lgPersistData`, `lgToggleExpandedRow` and `lgSwitchView` directives to attributes

### New features
* Added the `ServerDataProvider`
* Added the page size chooser to `lgPager`
* Updated Angular JS version to 1.4.1 in tests
* Added the changelog

Also added several unit tests and refactored the internals of the grid.

## v0.1.0
The first public release of Light Grid.

### Features
* custom cell templates
* paging
* sorting
* search
* expandable details
* dynamic column visibility
* inline data edit
