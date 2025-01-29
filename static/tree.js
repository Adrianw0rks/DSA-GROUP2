document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("tree-canvas");
    const ctx = canvas.getContext("2d");
    const nodeRadius = 20;
    const spacingY = 100; // Increased spacing between nodes

    let tree = null;

    class TreeNode {
        constructor(value) {
            this.value = value;
            this.left = null;
            this.right = null;
            this.x = null; // X-coordinate of the node
            this.y = null; // Y-coordinate of the node
        }
    }

    function insertNode(root, value, x = canvas.width / 2, y = spacingY, depth = 0, offset = canvas.width / 4) {
        if (!root) {
            const newNode = new TreeNode(value);
            newNode.x = x;
            newNode.y = y;
            return newNode;
        }
        // Allow insertion of letters
        if (value < root.value) {
            root.left = insertNode(
                root.left,
                value,
                root.x - offset,
                root.y + spacingY,
                depth + 1,
                offset / 2
            );
        } else if (value > root.value) {
            root.right = insertNode(
                root.right,
                value,
                root.x + offset,
                root.y + spacingY,
                depth + 1,
                offset / 2
            );
        } else {
            // Ignore duplicate values
            return root;
        }
        return root;
    }

    function deleteNode(root, value) {
        if (!root) return null;

        if (value < root.value) {
            root.left = deleteNode(root.left, value);
        } else if (value > root.value) {
            root.right = deleteNode(root.right, value);
        } else {
            // Node with only one child or no child
            if (!root.left) return root.right;
            if (!root.right) return root.left;

            // Node with two children: Get the inorder successor (smallest in the right subtree)
            let minNode = root.right;
            while (minNode.left) {
                minNode = minNode.left;
            }
            root.value = minNode.value;
            root.right = deleteNode(root.right, minNode.value);
        }
        return root;
    }

    function drawTree(root) {
        if (!root) return;

        // Clear the canvas before redrawing
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Calculate the center position for the tree
        const centerX = canvas.width / 2;

        // Recursively draw nodes and lines
        function drawNodeAndLines(node, xOffset) {
            if (!node) return;

            // Draw left subtree
            if (node.left) {
                drawLine(centerX + xOffset, node.y, centerX + xOffset - spacingY, node.left.y);
                drawNodeAndLines(node.left, xOffset - spacingY);
            }

            // Draw right subtree
            if (node.right) {
                drawLine(centerX + xOffset, node.y, centerX + xOffset + spacingY, node.right.y);
                drawNodeAndLines(node.right, xOffset + spacingY);
            }

            // Draw the current node
            drawNode(centerX + xOffset, node.y, node.value);
        }

        drawNodeAndLines(root, 0);
    }

    function drawNode(x, y, value) {
        ctx.beginPath();
        ctx.arc(x, y, nodeRadius, 0, 2 * Math.PI);
        ctx.fillStyle = "#4CAF50";
        ctx.fill();
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();

        // Draw the node's value
        ctx.fillStyle = "white";
        ctx.font = "12px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(value, x, y);
    }

    function drawLine(x1, y1, x2, y2) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
    }

    function showError(message) {
        const errorHolder = document.getElementById("error-holder");
        errorHolder.textContent = message;
        errorHolder.style.display = "block"; // Show the error message
    }

    document.getElementById("insert-btn").addEventListener("click", () => {
        const value = document.getElementById("insert-key").value; // Allow letters
        if (value.trim() === "") {
            showError("Please enter a valid value."); // Error handling for empty input
        } else {
            tree = insertNode(tree, value);
            drawTree(tree); // Draw the tree
            document.getElementById("error-holder").style.display = "none"; // Hide error message
        }
    });

    document.getElementById("delete-btn").addEventListener("click", () => {
        const value = document.getElementById("delete-key").value; // Allow letters
        if (value.trim() === "") {
            showError("Please enter a valid value."); // Error handling for empty input
        } else {
            tree = deleteNode(tree, value);
            drawTree(tree); // Draw the tree
            document.getElementById("error-holder").style.display = "none"; // Hide error message
        }
    });

    // Clear button functionality
    document.getElementById("clear-btn").addEventListener("click", () => {
        if (tree) {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
            tree = null; // Reset the tree
            document.getElementById("error-holder").style.display = "none"; // Hide error message
        } else {
            showError("The tree is already cleared."); // Error handling
        }
    });

    document.getElementById("resize-btn").addEventListener("click", () => {
        const newWidth = parseInt(document.getElementById("canvas-width").value, 10);
        const newHeight = parseInt(document.getElementById("canvas-height").value, 10);
        if (!isNaN(newWidth) && !isNaN(newHeight)) {
            canvas.width = newWidth;
            canvas.height = newHeight;

            // Keep the tree at the top center
            drawTree(tree); // Redraw the tree after resizing
        } else {
            showError("Please enter valid dimensions for the canvas."); // Error handling
        }
    });

    // Initialize canvas size
    canvas.width = 1200; // Increased initial width
    canvas.height = 800; // Increased initial height
});