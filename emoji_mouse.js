function getDist(pos1, pos2) {
    return Math.sqrt((pos1.x - pos2.x)**2 + (pos1.y - pos2.y)**2);
}

const emoji_array = [
    "🍇",
    "🍈",
    "🍉",
    "🍊",
    "🍋",
    "🍌",
    "🍍",
    "🥭",
    "🍎",
    "🍏",
]

let emoji_index = 0;

function createEmoji(position, emoji, element) {
    let $emojiElement = $(`<div class="emoji-popup">${emoji}</div>`).css(
        {
          "position": "absolute",
          "left": `${position.x}px`,
          "top": `${position.y}px`
        });

    $(element).append($emojiElement);

    setTimeout(function () {
        $emojiElement.remove();
    }, 500);
}

const MIN_DIST = 50;


let last_pos = null;

$(".banner").mousemove(function(event) {
    let pos = {x: event.pageX, y: event.pageY};
    if (last_pos == null) {
        last_pos = pos;
    }

    let dist = getDist(pos, last_pos);
    if (dist > MIN_DIST) {
        last_pos = pos;

        createEmoji(pos, emoji_array[emoji_index], $(this));
        emoji_index = (emoji_index + 1) % emoji_array.length;
    }
});