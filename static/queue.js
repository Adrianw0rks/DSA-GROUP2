// Function to update the visualization box
function updateVisualizationBox(data) {
    const visualizationBox = $("#visualization-box");
    visualizationBox.empty();
    data.forEach(item => {
        visualizationBox.append(`<div class="item">${item}</div>`);
    });
}

// Handle Enqueue
$("#enqueue-btn").click(function () {
    const value = $("#input-value").val();
    if (!value.trim()) {
        alert("Please enter a value!");
        return;
    }
    $.ajax({
        url: "/enqueue",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ data: value }),
        success: function (response) {
            updateVisualizationBox(response.queue);
        }
    });
});

// Handle Dequeue
$("#dequeue-btn").click(function () {
    $.ajax({
        url: "/dequeue",
        type: "POST",
        success: function (response) {
            alert("Dequeued: " + response.removed);
            updateVisualizationBox(response.queue);
        }
    });
});