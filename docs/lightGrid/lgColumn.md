#lgColumn directive

Defines a column template.
Inside the template, a `rowData` object is accessible in the scope. It contains data from a single record of the data model.

##Attributes
| attribute         | type           | description                                                                        |
| ----------------- | -------------- | ---------------------------------------------------------------------------------- |
| title             | string         | Title of the column (used to render a header if header template is not specified). |
| visible           | boolean        | Determines if a column is rendered.                                                |

##Examples
    <lightGrid model="myModel" id="myGrid">
        <lgColumn title="'Name'">
            {{ rowData.name }}
        </lgColumn>

        <lgColumn title="'Address'">
            {{ rowData.address }}
        </lgColumn>
    </lightGrid>
