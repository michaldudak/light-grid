/* exported getBlockNodes */

function getBlockNodes(nodes) {
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