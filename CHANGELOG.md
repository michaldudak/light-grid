#Changelog

##v0.2.0

###Breaking changes
* Renamed the `lightGrid` directive to `lgGrid`
* Renamed the `persistData` directive to `lgPersistData`
* Renamed the `switchView` directive to `lgSwitchView`
* Restricted `lgPersistData`, `lgToggleExpandedRow` and `lgSwitchView` directives to attributes

###New features
* Added the `ServerDataProvider`
* Added the page size chooser to `lgPager`
* Updated Angular JS version to 1.4.1 in tests
* Added the changelog

Also added several unit tests and refactored the internals of the grid.

##v0.1.0
The first public release of Light Grid.

###Features
* custom cell templates
* paging
* sorting
* search
* expandable details
* dynamic column visibility
* inline data edit