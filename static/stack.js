window.addEventListener('resize', adjustBodyPadding);

function adjustBodyPadding() {
    const header = document.querySelector('header');
    const body = document.body;

    // Get the header height dynamically
    const headerHeight = header.offsetHeight;

    // Adjust the body padding-top based on header height
    body.style.paddingTop = `${headerHeight}px`;
}

// Adjust padding on page load
adjustBodyPadding();
