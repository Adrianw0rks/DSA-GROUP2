document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("start-sort");
    const barsContainer = document.getElementById("bars-container");

    function createBars(numbers) {
        barsContainer.innerHTML = ""; // Clear existing bars
        console.log("Creating bars for:", numbers); // Log the numbers being visualized
        numbers.forEach((value) => {
            // Create a bar
            const bar = document.createElement('div');
            bar.classList.add('bar');
            bar.style.height = `${value * 5}px`;

            const label = document.createElement('div');
            label.classList.add('bar-label');
            label.textContent = value;

            bar.appendChild(label);
            barsContainer.appendChild(bar);
        });
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function bubbleSort(numbers) {
        const n = numbers.length;
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                const bars = Array.from(barsContainer.children);
                // Highlight the bars being compared
                bars[j].style.backgroundColor = "red"; // Comparison color
                bars[j + 1].style.backgroundColor = "red"; // Comparison color
                await sleep(500); // Delay for animation

                if (numbers[j] > numbers[j + 1]) {
                    // Swap
                    [numbers[j], numbers[j + 1]] = [numbers[j + 1], numbers[j]];
                    createBars(numbers); // Update bars
                    await sleep(500); // Delay for swap animation
                }

                // Reset colors
                bars[j].style.backgroundColor = "blue";
                bars[j + 1].style.backgroundColor = "blue";
            }
            // Mark the last sorted element as green
            const bars = Array.from(barsContainer.children);
            bars[n - i - 1].style.backgroundColor = "green"; // Correct position color
        }
    }

    async function selectionSort(numbers) {
        const n = numbers.length;
        for (let i = 0; i < n; i++) {
            let minIndex = i;
            for (let j = i + 1; j < n; j++) {
                const bars = Array.from(barsContainer.children);
                bars[i].style.backgroundColor = "red"; // Current element color
                bars[j].style.backgroundColor = "red"; // Comparison color
                await sleep(500); // Delay for animation

                if (numbers[j] < numbers[minIndex]) {
                    minIndex = j;
                }
                // Reset colors
                bars[i].style.backgroundColor = "blue";
                bars[j].style.backgroundColor = "blue";
            }
            // Swap
            [numbers[i], numbers[minIndex]] = [numbers[minIndex], numbers[i]];
            createBars(numbers); // Update bars
            await sleep(500); // Delay for swap animation
            // Mark the last sorted element as green
            const bars = Array.from(barsContainer.children);
            bars[i].style.backgroundColor = "green"; // Correct position color
        }
    }

    async function insertionSort(numbers) {
        const n = numbers.length;
        for (let i = 1; i < n; i++) {
            let key = numbers[i];
            let j = i - 1;
            while (j >= 0 && numbers[j] > key) {
                const bars = Array.from(barsContainer.children);
                bars[j].style.backgroundColor = "red"; // Shifting color
                await sleep(500); // Delay for animation
                numbers[j + 1] = numbers[j];
                j--;
                createBars(numbers); // Update bars
            }
            numbers[j + 1] = key;
            createBars(numbers); // Update bars
            // Mark the last sorted element as green
            const bars = Array.from(barsContainer.children);
            bars[j + 1].style.backgroundColor = "green"; // Correct position color
        }
    }

    async function quickSort(numbers, low, high) {
        if (low < high) {
            const pi = await partition(numbers, low, high);
            await quickSort(numbers, low, pi - 1);
            await quickSort(numbers, pi + 1, high);
        }
    }

    async function partition(numbers, low, high) {
        const pivot = numbers[high];
        let i = low - 1;
        for (let j = low; j < high; j++) {
            const bars = Array.from(barsContainer.children);
            bars[j].style.backgroundColor = "red"; // Comparison color
            await sleep(500); // Delay for animation

            if (numbers[j] < pivot) {
                i++;
                [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
                createBars(numbers); // Update bars
                await sleep(500); // Delay for swap animation
            }
            // Reset colors
            bars[j].style.backgroundColor = "blue";
        }
        [numbers[i + 1], numbers[high]] = [numbers[high], numbers[i + 1]];
        createBars(numbers); // Update bars
        await sleep(500); // Delay for swap animation
        // Mark the last sorted element as green
        const bars = Array.from(barsContainer.children);
        bars[i + 1].style.backgroundColor = "green"; // Correct position color
        return i + 1;
    }

    async function mergeSort(numbers) {
        if (numbers.length <= 1) return numbers;
        const mid = Math.floor(numbers.length / 2);
        const left = await mergeSort(numbers.slice(0, mid));
        const right = await mergeSort(numbers.slice(mid));
        return await merge(left, right);
    }

    async function merge(left, right) {
        const result = [];
        let i = 0, j = 0;
        while (i < left.length && j < right.length) {
            const bars = Array.from(barsContainer.children);
            await sleep(500); // Delay for animation

            if (left[i] < right[j]) {
                result.push(left[i]);
                i++;
            } else {
                result.push(right[j]);
                j++;
            }
            createBars([...result, ...left.slice(i), ...right.slice(j)]); // Update bars
        }
        return [...result, ...left.slice(i), ...right.slice(j)];
    }

    startButton.addEventListener("click", async () => {
        const rawInput = document.getElementById('numbers').value;
        const values = rawInput.split(',').map((v) => v.trim()).filter(v => !isNaN(v)).map(Number);
        if (values.length > 0) {
            createBars(values); // Initial bar creation
            const algorithm = document.getElementById('algorithm').value;
            if (algorithm === 'bubble_sort') {
                await bubbleSort(values);
            } else if (algorithm === 'selection_sort') {
                await selectionSort(values);
            } else if (algorithm === 'insertion_sort') {
                await insertionSort(values);
            } else if (algorithm === 'quick_sort') {
                await quickSort(values, 0, values.length - 1);
            } else if (algorithm === 'merge_sort') {
                await mergeSort(values);
            }
        } else {
            alert('Please enter valid numbers separated by commas.');
        }
    });
});