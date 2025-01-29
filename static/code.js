//step 1: get DOM
let nextDom = document.getElementById('next');
let prevDom = document.getElementById('prev');

let carouselDom = document.querySelector('.carousel');
let SliderDom = carouselDom.querySelector('.carousel .list');
let thumbnailBorderDom = document.querySelector('.carousel .thumbnail');
let thumbnailItemsDom = thumbnailBorderDom.querySelectorAll('.item');
let timeDom = document.querySelector('.carousel .time');

thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);
let timeRunning = 3000;
let timeAutoNext = 10000;

nextDom.onclick = function(){
    showSlider('next');    
}

prevDom.onclick = function(){
    showSlider('prev');    
}
let runTimeOut;
let runNextAuto = setTimeout(() => {
    next.click();
}, timeAutoNext)
function showSlider(type){
    let  SliderItemsDom = SliderDom.querySelectorAll('.carousel .list .item');
    let thumbnailItemsDom = document.querySelectorAll('.carousel .thumbnail .item');
    
    if(type === 'next'){
        SliderDom.appendChild(SliderItemsDom[0]);
        thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);
        carouselDom.classList.add('next');
    }else{
        SliderDom.prepend(SliderItemsDom[SliderItemsDom.length - 1]);
        thumbnailBorderDom.prepend(thumbnailItemsDom[thumbnailItemsDom.length - 1]);
        carouselDom.classList.add('prev');
    }
    clearTimeout(runTimeOut);
    runTimeOut = setTimeout(() => {
        carouselDom.classList.remove('next');
        carouselDom.classList.remove('prev');
    }, timeRunning);

    clearTimeout(runNextAuto);
    runNextAuto = setTimeout(() => {
        next.click();
    }, timeAutoNext)
}
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
