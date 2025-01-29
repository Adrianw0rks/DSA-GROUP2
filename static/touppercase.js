$(document).ready(function () {
    // Dynamically adjust gallery offset based on header height
    let headerHeight = $('header').outerHeight(); // Get the height of the header
    $('.gallery').css('margin-top', headerHeight + 'px');

    $('.buttons').click(function () {
        $(this).addClass('active').siblings().removeClass('active');

        let filter = $(this).attr('data-filter');
        if (filter === 'all') {
            $('.image').fadeIn(400);
        } else {
            $('.image').not('.' + filter).fadeOut(200);
            $('.image').filter('.' + filter).fadeIn(400);
        }
    });

    // Gallery Popup (if used)
    $('.gallery').magnificPopup({
        delegate: 'a',
        type: 'image',
        gallery: {
            enabled: true,
        },
    });
});
