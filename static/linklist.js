// Handle dropdown toggle on click
const worksDropdown = document.querySelector('.works-dropdown');
const dropdownContent = worksDropdown.querySelector('.dropdown-content');

// Event listener for dropdown toggle on "Works" link click
worksDropdown.addEventListener('click', (event) => {
    event.stopPropagation(); // Prevent event from bubbling up to document
    toggleDropdown(event);
});

// Function to toggle dropdown visibility
function toggleDropdown(event) {
    // Only prevent default for the main "Works" link, not for items inside the dropdown
    if (event.target.classList.contains('works-link')) {
        event.preventDefault();
    }
    dropdownContent.classList.toggle('show'); // Toggle visibility
}

// Close dropdown if clicking outside of it
document.addEventListener('click', function (e) {
    // Close dropdown if click is outside or on a link
    if (!worksDropdown.contains(e.target) || e.target.tagName === 'A') {
        dropdownContent.classList.remove('show');
    }
});

// Optional: Handle dropdown hover (if needed) - Remove this if not required
worksDropdown.addEventListener('mouseenter', () => {
    dropdownContent.style.display = 'block';
});

worksDropdown.addEventListener('mouseleave', () => {
    dropdownContent.style.display = 'none';
});
