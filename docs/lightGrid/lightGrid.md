#lightGrid directive

The `lightGrid` is the main directive. It is used to define a grid. Configuration is done via its subdirectives.
It can be used either as a custom tag or on a `table` tag.

##Attributes
| attribute         | type           | description                                         |
| ----------------- | -------------- | --------------------------------------------------- |
| model             | object array   | Provides the model to display.                      |
| initialView       | string         | Specifies name of the view the grid will start in.  |
| id                | string         | Specifies an ID of the grid.                        |

##Examples
    <lightGrid model="myModel" id="myGrid">
    </lightGrid>

    <table light-grid id="myGrid" model="myModel">
    </table>
