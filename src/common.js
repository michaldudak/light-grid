/* exported getBlockNodes */

function getBlockNodes(nodes) {
	// TODO(perf): just check if all items in `nodes` are siblings and if they are return the original
	// collection, otherwise update the original collection.

	var node = nodes[0];
	var endNode = nodes[nodes.length - 1];
	var blockNodes = [node];

	do {
		node = node.nextSibling;
		if (!node) {
			break;
		}
		blockNodes.push(node);
	} while (node !== endNode);

	return angular.element(blockNodes);
}