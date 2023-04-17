const BOB_ANIMATION_DURATION = 1;

$(".link").each(function() {
    const text = $(this).text();
    $(this).text("");
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const delay = i * BOB_ANIMATION_DURATION * 0.2;
        $link_letter = $(`<div class="link-letter">${char}</div>`).css(
        {
          "display": "inline-block",
          "animation-delay": `${delay}s`
        });

        $(this).append($link_letter);
    }
});

$(".link").hover(
    function() {
        $(this).children(".link-letter").each(function() {
            $(this).addClass("hover-wave");
        });
    }, 
    function () {
        $(this).children(".link-letter").each(function() {
            $(this).removeClass("hover-wave");
        });
    }
);