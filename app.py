from flask import Flask, render_template, jsonify,  request
import heapq
app = Flask(__name__)

class LinkedList:
    def search(self, data):
        current = self.head
        index = 0
        while current:
            if current.data == data:
                return index  # Return the index if the data is found
            current = current.next
            index += 1
        return -1  # Return -1 if the data is not found
    def __init__(self):
        self.head = None

    def append(self, data):
        new_node = Node(data)
        if not self.head:
            self.head = new_node
            return
        last = self.head
        while last.next:
            last = last.next
        last.next = new_node

    def insert_at_beginning(self, data):
        new_node = Node(data)
        new_node.next = self.head
        self.head = new_node

    def insert_at_index(self, index, data):
        if index == 0:
            self.insert_at_beginning(data)
            return
        new_node = Node(data)
        current = self.head
        count = 0
        while current and count < index - 1:
            current = current.next
            count += 1
        if current:
            new_node.next = current.next
            current.next = new_node
        else:
            self.append(data)

    def remove_from_beginning(self):
        if self.head:
            removed_data = self.head.data
            self.head = self.head.next
            return removed_data
        return None

    def remove_from_end(self):
        if not self.head:
            return None
        if not self.head.next:
            removed_data = self.head.data
            self.head = None
            return removed_data
        current = self.head
        while current.next and current.next.next:
            current = current.next
        removed_data = current.next.data
        current.next = None
        return removed_data

    def remove_at_index(self, index):
        if index == 0 and self.head:
            removed_data = self.head.data
            self.head = self.head.next
            return removed_data
        current = self.head
        count = 0
        while current and current.next and count < index - 1:
            current = current.next
            count += 1
        if current and current.next:
            removed_data = current.next.data
            current.next = current.next.next
            return removed_data
        return None

    def remove_specific(self, data):
        current = self.head
        if current and current.data == data:
            self.head = current.next
            return data
        while current and current.next:
            if current.next.data == data:
                current.next = current.next.next
                return data
            current = current.next
        return None

    def __str__(self):
        result = []
        current = self.head
        while current:
            result.append(current.data)
            current = current.next
        return ' ➯ '.join(map(str, result))
    
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

linked_list = LinkedList()

def shunting_yard_with_steps(infix_expr):
    # Precedence and associativity of operators
    precedence = {'+': 1, '-': 1, '*': 2, '/': 2, '^': 3}
    right_associative = {'^'}
    operators = set(precedence.keys())
    
    # Stack to store operators
    operator_stack = []
    # List to store postfix expression
    postfix_expr = []
    # Step-by-step log
    steps = []

    # Tokenize the input (supports multi-character operands)
    tokens = infix_expr.split()

    for i, token in enumerate(tokens):
        if token.isalnum():  # Operand (variable or number)
            postfix_expr.append(token)
        elif token in operators:  # Operator
            while (operator_stack and 
                   operator_stack[-1] in operators and 
                   ((token not in right_associative and precedence[token] <= precedence[operator_stack[-1]]) or
                    (token in right_associative and precedence[token] < precedence[operator_stack[-1]]))):
                postfix_expr.append(operator_stack.pop())
            operator_stack.append(token)
        elif token == '(':  # Left parenthesis
            operator_stack.append(token)
        elif token == ')':  # Right parenthesis
            while operator_stack and operator_stack[-1] != '(':
                postfix_expr.append(operator_stack.pop())
            if operator_stack and operator_stack[-1] == '(':
                operator_stack.pop()  # Discard the left parenthesis
            else:
                raise ValueError("Mismatched parentheses")
        else:
            raise ValueError(f"Invalid token: {token}")

        # Log the current step
        steps.append({
            'step': i,
            'expression': token,
            'stack': ' '.join(operator_stack),
            'postfix': ' '.join(postfix_expr)
        })

    # Pop remaining operators in the stack
    while operator_stack:
        top = operator_stack.pop()
        if top in "()":
            raise ValueError("Mismatched parentheses")
        postfix_expr.append(top)
        steps.append({
            'step': len(steps),
            'expression': '',
            'stack': ' '.join(operator_stack),
            'postfix': ' '.join(postfix_expr)
        })

    return " ".join(postfix_expr), steps
# Queue class using Linked List
class Queue:
    def __init__(self):
        self.front = None
        self.rear = None

    def enqueue(self, data):
        new_node = Node(data)
        if self.rear is None:  # Queue is empty
            self.front = self.rear = new_node
            return
        self.rear.next = new_node  # Link the new node
        self.rear = new_node  # Update rear pointer

    def dequeue(self):
        if self.front is None:  # Queue is empty
            return None
        temp = self.front  # Store the current front
        self.front = self.front.next  # Move front to the next node
        if self.front is None:  # If the queue is now empty
            self.rear = None
        return temp.data  # Return the dequeued value

    def get_elements(self):
        elements = []
        current = self.front
        while current:  # Traverse from front to rear
            elements.append(current.data)
            current = current.next
        # Reverse the list to make the rear come first
        return elements[::-1]

# Initialize the queue
queue = Queue()
error_message = ""  # Variable to hold any error messages

class LineGraph:
    def __init__(self):
        self.vertices = {}

    def add_vertices(self, vertex):
        """Add a vertex to the graph."""
        if vertex not in self.vertices:
            self.vertices[vertex] = []

    def add_edge(self, source, target, time):
        """Add a weighted edge between source and target vertices with time."""
        self.add_vertices(source)
        self.add_vertices(target)
        self.vertices[source].append((target, time))
        self.vertices[target].append((source, time))

    def __str__(self):
        return str(self.vertices)


def dijkstra_shortest_time(graph, start):
    """Dijkstra's algorithm to find the shortest path based on time from the start vertex."""
    pq = [(0, start)]  # (time, vertex)
    times = {start: 0}
    predecessors = {start: None}
    
    while pq:
        current_time, current_vertex = heapq.heappop(pq)

        if current_time > times.get(current_vertex, float('inf')):
            continue

        for neighbor, time in graph[current_vertex]:
            new_time = current_time + time
            if new_time < times.get(neighbor, float('inf')):
                times[neighbor] = new_time
                predecessors[neighbor] = current_vertex
                heapq.heappush(pq, (new_time, neighbor))

    return times, predecessors

def print_shortest_time_path(predecessors, times, start, target):
    """Reconstruct and return the shortest path based on time with instructions."""
    path = []
    current = target
    while current is not None:
        path.append(current)
        current = predecessors.get(current)
    path.reverse()

    # Prepare the result dictionary
    if path[0] == start:
        return {
            "start": start,
            "end": target,
            "path": " -> ".join(path)
        }
    else:
        return {
            "start": start,
            "end": target,
            "path": "No path exists from {} to {}.".format(start, target)
        }



# Define the MRT graph with travel times between stations
line_graph = LineGraph()

# LRT Line 1
line_graph.add_edge('Roosevelt', 'Balintawak', 5)
line_graph.add_edge('Balintawak', 'Monumento', 4)
line_graph.add_edge('Monumento', '5th Avenue', 3)
line_graph.add_edge('5th Avenue', 'R. Papa', 2)
line_graph.add_edge('R. Papa', 'Abad Santos', 3)
line_graph.add_edge('Abad Santos', 'Blumentritt', 2)
line_graph.add_edge('Blumentritt', 'Tayuman', 2)
line_graph.add_edge('Tayuman', 'Bambang', 3)
line_graph.add_edge('Bambang', 'Doroteo Jose', 4)
line_graph.add_edge('Doroteo Jose', 'Carriedo', 2)
line_graph.add_edge('Carriedo', 'Central Terminal', 1)
line_graph.add_edge('Central Terminal', 'United Nations', 1)
line_graph.add_edge('United Nations', 'Pedro Gil', 3)
line_graph.add_edge('Pedro Gil', 'Quirino', 2)
line_graph.add_edge('Quirino', 'Vito Cruz', 2)
line_graph.add_edge('Vito Cruz', 'Gil Puyat', 2)
line_graph.add_edge('Gil Puyat', 'Libertad', 2)
line_graph.add_edge('Libertad', 'EDSA', 3)
line_graph.add_edge('EDSA', 'Baclaran', 9)

# LRT Line 2
line_graph.add_edge('Antipolo', 'Marikina', 7)
line_graph.add_edge('Marikina', 'Santolan', 5)
line_graph.add_edge('Santolan', 'Katipunan', 4)
line_graph.add_edge('Katipunan', 'Anonas', 3)
line_graph.add_edge('Anonas', 'Araneta Center Cubao - LRT 2', 2)
line_graph.add_edge('Araneta Center Cubao - LRT 2', 'Betty Go Belmonte', 2)
line_graph.add_edge('Betty Go Belmonte', 'Gilmore', 2)
line_graph.add_edge('Gilmore', 'J. Ruiz', 3)
line_graph.add_edge('J. Ruiz', 'V. Mapa', 3)
line_graph.add_edge('V. Mapa', 'Pureza', 3)
line_graph.add_edge('Pureza', 'Legarda', 3)
line_graph.add_edge('Legarda', 'Recto', 2)

# MRT Line 3
line_graph.add_edge('North Avenue', 'Quezon Avenue', 2)
line_graph.add_edge('Quezon Avenue', 'GMA Kamuning', 2)
line_graph.add_edge('GMA Kamuning', 'Araneta Center Cubao - MRT 3', 3)
line_graph.add_edge('Araneta Center Cubao - MRT 3', 'Santolan Anapolis', 3)
line_graph.add_edge('Santolan Anapolis', 'Ortigas', 3)
line_graph.add_edge('Ortigas', 'Shaw Boulevard', 3)
line_graph.add_edge('Shaw Boulevard', 'Boni', 2)
line_graph.add_edge('Boni', 'Guadalupe', 2)
line_graph.add_edge('Guadalupe', 'Buendia', 3)
line_graph.add_edge('Buendia', 'Ayala', 2)
line_graph.add_edge('Ayala', 'Magallanes', 3)
line_graph.add_edge('Magallanes', 'Taft Avenue', 3)


# Connect LRT 1 and LRT 2 (connecting station Recto and Doroteo Jose)
line_graph.add_edge('Recto', 'Doroteo Jose', 0)  # Both stations are connected with zero time as it's the same location.

# Connect LRT 2 and MRT (connecting station Araneta Center Cubao)
line_graph.add_edge('Araneta Center Cubao - LRT 2', 'Araneta Center Cubao - MRT 3', 0)  # Connecting LRT2 and MRT3

# Connect LRT 1 and MRT (connecting stations EDSA and Taft Avenue)
line_graph.add_edge('EDSA', 'Taft Avenue', 0)  # Connecting LRT1 and MRT

class TreeNode:
    def __init__(self, key):
        self.key = key
        self.left = None
        self.right = None


class BinarySearchTree:
    def __init__(self):
        self.root = None

    def insert(self, key):
        """Insert a key into the BST without creating cycles."""
        if not self.root:
            self.root = TreeNode(key)  # Initialize root if tree is empty
        else:
            self._insert(self.root, key)

    def _insert(self, current, key):
        """Helper recursive function to insert into the tree."""
        if key < current.key:
            if current.left:
                self._insert(current.left, key)
            else:
                current.left = TreeNode(key)  # Create a new node here
        elif key > current.key:
            if current.right:
                self._insert(current.right, key)
            else:
                current.right = TreeNode(key)  # Create a new node here
        # Ignore duplicate keys to avoid issues

    def delete(self, key):
        """Delete a key from the BST."""
        self.root = self._delete(self.root, key)

    def _delete(self, root, key):
        """Recursive deletion helper."""
        if not root:
            return root
        if key < root.key:
            root.left = self._delete(root.left, key)
        elif key > root.key:
            root.right = self._delete(root.right, key)
        else:
            # Node to be deleted found
            if not root.left:
                return root.right
            elif not root.right:
                return root.left
            # Node with two children: get the in-order successor
            min_larger_node = self._get_min(root.right)
            root.key = min_larger_node.key
            root.right = self._delete(root.right, min_larger_node.key)
        return root

    def has_cycle(self, node, visited=set()):
        """Detect cycles in the tree."""
        if not node:
            return False
        if node in visited:  # If the node is already visited, it's a cycle
            return True
        visited.add(node)
        return self.has_cycle(node.left, visited) or self.has_cycle(node.right, visited)

tree = BinarySearchTree()  # Create a Binary Search Tree instance

def bubble_sort(lista):
    n = len(lista)
    animations = []
    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            animations.append((j, j + 1))  # Record the indices being compared
            if lista[j] > lista[j + 1]:
                lista[j], lista[j + 1] = lista[j + 1], lista[j]
                swapped = True
                animations.append((j, j + 1, True))  # Record the swap
        if not swapped:
            break
    return lista, animations


def selection_sort(lista):
    n = len(lista)
    animations = []
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            animations.append((min_idx, j))  # Record the indices being compared
            if lista[j] < lista[min_idx]:
                min_idx = j
        if min_idx != i:
            lista[i], lista[min_idx] = lista[min_idx], lista[i]
            animations.append((i, min_idx, True))  # Record the swap
    return lista, animations


def insertion_sort(lista):
    animations = []
    for i in range(1, len(lista)):
        key = lista[i]
        j = i - 1
        while j >= 0 and lista[j] > key:
            animations.append((j, j + 1))  # Record the shifting
            lista[j + 1] = lista[j]
            j -= 1
        lista[j + 1] = key
        animations.append((j + 1, i, True))  # Record the insertion
    return lista, animations


def quick_sort(lista):
    animations = []
    
    def _quick_sort_helper(lista, low, high):
        if low < high:
            pi, anim = partition(lista, low, high)
            animations.extend(anim)
            _quick_sort_helper(lista, low, pi - 1)
            _quick_sort_helper(lista, pi + 1, high)
    
    def partition(lista, low, high):
        pivot = lista[high]
        i = low - 1
        local_animations = []
        for j in range(low, high):
            local_animations.append((j, high))  # Record comparison with pivot
            if lista[j] < pivot:
                i += 1
                lista[i], lista[j] = lista[j], lista[i]
                local_animations.append((i, j, True))  # Record swap
        lista[i + 1], lista[high] = lista[high], lista[i + 1]
        local_animations.append((i + 1, high, True))  # Record pivot swap
        return i + 1, local_animations
    
    _quick_sort_helper(lista, 0, len(lista) - 1)
    return lista, animations


def merge_sort(lista):
    animations = []
    
    def _merge_sort(arr, temp, left, right):
        if left < right:
            mid = (left + right) // 2
            _merge_sort(arr, temp, left, mid)
            _merge_sort(arr, temp, mid + 1, right)
            merge(arr, temp, left, mid, right)
    
    def merge(arr, temp, left, mid, right):
        i, j, k = left, mid + 1, left
        while i <= mid and j <= right:
            animations.append((i, j))  # Record comparison
            if arr[i] <= arr[j]:
                temp[k] = arr[i]
                i += 1
            else:
                temp[k] = arr[j]
                j += 1
            k += 1
        while i <= mid:
            temp[k] = arr[i]
            k += 1
            i += 1
        while j <= right:
            temp[k] = arr[j]
            k += 1
            j += 1
        for k in range(left, right + 1):
            arr[k] = temp[k]
            animations.append((k, arr[k], True))  # Record assignment
    
    temp = lista[:]
    _merge_sort(lista, temp, 0, len(lista) - 1)
    return lista, animations



@app.route('/')
def home():
    return render_template('index.html')

@app.route('/code')
def code():
    return render_template('code.html')

@app.route('/profile')
def profile():
    return render_template('profile.html')

@app.route("/works", methods=["GET", "POST"])
def works():
    return render_template("touppercase.html")

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        # Retrieve form data
        name = request.form.get('name')
        email = request.form.get('email')
        message = request.form.get('message')

        # Redirect to the success page with the captured data
        return render_template('success.html', name=name, email=email, message=message)
    return render_template('contact.html')  # Render your contact form if GET request


@app.route("/linkedlist", methods=["GET", "POST"])
def linkedlist():
    removed_data = None
    search_result = None  # For storing the search result
    error_message = None

    if request.method == "POST":
        action = request.form.get("action")
        data = request.form.get("data", "").strip()
        index = request.form.get("index", "").strip()

        if action == "Add to List" and data:
            linked_list.append(data)
        elif action == "Insert at Beginning" and data:
            linked_list.insert_at_beginning(data)
        elif action == "Insert at End" and data:
            linked_list.append(data)
        elif action == "Insert at Index" and data and index.isdigit():
            linked_list.insert_at_index(int(index), data)
        elif action == "Remove from Beginning":
            removed_data = linked_list.remove_from_beginning()
        elif action == "Remove from End":
            removed_data = linked_list.remove_from_end()
        elif action == "Remove at Index" and index.isdigit():
            removed_data = linked_list.remove_at_index(int(index))
        elif action == "Remove Specific Data" and data:
            removed_data = linked_list.remove_specific(data)
            if removed_data is None:
                error_message = f"Error: '{data}' was not found in the linked list."
        elif action == "Search Data" and data:
            search_result = linked_list.search(data)
            if search_result == -1:
                error_message = f"Error: '{data}' was not found in the linked list."

    return render_template(
        "linkedlist.html",
        linked_list=str(linked_list),
        removed_data=removed_data,
        search_result=search_result,
        error_message=error_message,
    )
@app.route("/stack", methods=["GET", "POST"])
def stack():
    result = None
    error = None
    steps = None
    if request.method == "POST":
        infix_expr = request.form.get("infix_expression")
        try:
            result, steps = shunting_yard_with_steps(infix_expr)
        except ValueError as e:
            error = str(e)
    return render_template("stack.html", result=result, error=error, steps=steps)
@app.route('/queue', methods=['GET'])
def queue_view():
    global error_message
    action = request.args.get('action')  # Get action from the query string
    value = request.args.get('value')   # Get value for enqueue (if any)

    # Perform actions based on the query parameter
    if action == 'enqueue' and value:
        if not value.strip():  # Check for empty or whitespace-only input
            error_message = "Input cannot be empty. Please enter a valid value."
        else:
            queue.enqueue(value)
    elif action == 'dequeue':
        if queue.front is None:  # Queue is empty
            error_message = "Queue is empty. Cannot dequeue."
        else:
            queue.dequeue()

    # Clear the error message after displaying
    temp_error = error_message
    error_message = ""
  

    return render_template('queue.html', queue_elements=queue.get_elements(), error=temp_error)

@app.route('/graph', methods=['GET', 'POST'])
def graph_view():
    if request.method == 'POST':
        source = request.form['start_station']
        destination = request.form['end_station']

        if source in line_graph.vertices and destination in line_graph.vertices:
            # Perform Dijkstra's algorithm
            times, predecessors = dijkstra_shortest_time(line_graph.vertices, source)
            result = print_shortest_time_path(predecessors, times, source, destination)
        else:
            result = {
                "start": "",
                "end": "",
                "path": "Invalid source or destination.",
                "time": "N/A",
                "distance": "N/A"
            }

        return render_template('graph.html', result=result)

    return render_template('graph.html', result=None)
tree = BinarySearchTree()  # Create a Binary Search Tree instance


@app.route('/Tree', methods=['GET', 'POST'])
def tree_view():
    return render_template('Tree.html')  # Render the main page


@app.route('/insert', methods=['POST'])
def insert():
    try:
        data = request.json
        key = int(data['key'])
        tree.insert(key)
        return jsonify({'status': 'success', 'message': f'Inserted {key}', 'tree': tree.to_list()})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400


@app.route('/delete', methods=['POST'])
def delete():
    try:
        data = request.json
        key = int(data['key'])
        tree.delete(key)
        return jsonify({'status': 'success', 'message': f'Deleted {key}', 'tree': tree.to_list()})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400


@app.route('/view_tree', methods=['GET'])
def view_tree():
    try:
        return jsonify({'status': 'success', 'tree': tree.to_list()})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400

@app.route('/sort', methods=['GET', 'POST'])
def sort():
    if request.method == 'GET':
        # Render the form on a GET request
        return render_template('sorting.html')
    
    # Handle POST request for sorting
    algorithm = request.form.get('algorithm')
    raw_list = request.form.get('numbers')
    raw_items = raw_list.split(',') if raw_list else []
    lista = [item.strip() for item in raw_items if item.strip().isdigit()]

    if not lista:
        return render_template('sorting.html', message="Invalid input. Please enter a valid list of numbers.")

    lista = list(map(int, lista))

    if algorithm == 'bubble_sort':
        result, animations = bubble_sort(lista)
    elif algorithm == 'selection_sort':
        result, animations = selection_sort(lista)
    elif algorithm == 'insertion_sort':
        result, animations = insertion_sort(lista)
    elif algorithm == 'quick_sort':
        result, animations = quick_sort(lista)
    elif algorithm == 'merge_sort':
        result, animations = merge_sort(lista)
    else:
        result, animations = [], []

    return render_template('sorting.html', raw_list=raw_list, sorted_list=result, animations=animations)




if __name__ == "__main__":
    app.run(debug=True)
