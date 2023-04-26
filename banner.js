// Helper method
async function delay(time) {
    return new Promise((resolve) => {
        setTimeout(resolve, time * 1000);
    });
};

const TYPE_SPEED = 0.08;
const DELETE_SPEED = 0.08;
const CUROSR_MOVE_TO_SPEED = 0.1;
// Banner animation
// Each word is one span element
// 
// 

/*
    STEPS 1
    - Type "Jackson Medina"
*/

let animations = [];

// Current Element with from set cursor
let cursorData = {
    cursorElement: null,
    lineElement: null,
    index: -1,
}
handlingAnimation = false;

function disableCursor() {
    // Disable cursor if possible
    if (cursorData.cursorElement != null) {
        cursorData.cursorElement.removeClass("cursor");
        cursorData.cursorElement.removeClass("cursor-blink");
    }
}

function typeMessage(message, index, lineElement) {
    const animation_data = {
        type : "TypeMessage",
        message : message,
        index : index,
        line : lineElement
    }
    
    animations.push(animation_data);
    handleAnimations(animations);
}

// Takes a dom element
async function handleTypeMessage(message, index, line) {
    // Get number of siblings
    let count = $(line).children().length;

    disableCursor()

    // Previously typed character
    let lastElement = null;
    // Add at the end
    if (index > count - 1) {

        // Type the messages
        for (let i = 0; i < message.length; i++) {
            const char = message.substring(i, i+1);
            let element = $(`<div class="banner-letter"></div>`).text(char);
            $(line).append(element);

            if (lastElement != null) {
                lastElement.removeClass("cursor");
                lastElement.removeClass("cursor-blink");
            }
            element.toggleClass("cursor");
            await delay(TYPE_SPEED);
            lastElement = element;
        }
    }

    // Add before element at index
    else {
        const nthChild = $(line).children().eq(index);

        // Type the messages
        for (let i = 0; i < message.length; i++) {
            const char = message.substring(i, i+1);
            let element = $(`<div class="banner-letter"></div>`).text(char);
            element.insertBefore(nthChild);
            await delay(TYPE_SPEED);

            if (lastElement != null) {
                lastElement.removeClass("cursor");
                lastElement.removeClass("cursor-blink");
            }
            element.toggleClass("cursor");
            lastElement = element;
        }
    }

    if (lastElement != null) {
        lastElement.removeClass("cursor");
        lastElement.removeClass("cursor-blink");
    }
}

function setCursor(index, line) {
    const animation_data = {
        type : "SetCursor",
        index : index,
        line : line
    }
    
    animations.push(animation_data);
    handleAnimations(animations);
}

async function handleSetCursor(index, line) {
    // Get the character to put the cursor on
    const nthChild = $(line).children().eq(index);
    cursorData.cursorElement = nthChild;
    nthChild.addClass("cursor-blink");
    nthChild.addClass("cursor");
}


async function handleSetCursorNoBlink(index, line) {
    // Get the character to put the cursor on
    const nthChild = $(line).children().eq(index);
    cursorData.cursorElement = nthChild;
    nthChild.removeClass("cursor-blink");
    nthChild.addClass("cursor");
}

function moveCursorTo(startIndex, endIndex, line) {
    const animation_data = {
        type : "MoveCursorTo",
        startIndex : startIndex,
        endIndex : endIndex,
        line : line
    }
    animations.push(animation_data);
    handleAnimations(animations);
}

async function handleMoveCursorTo(startIndex, endIndex, line) {
    disableCursor();

    handleSetCursorNoBlink(startIndex, line);
    let inc = 1;
    // Descending
    if ((startIndex - endIndex) > 0) {
        inc = -1;
    }

    let i = startIndex;
    while (i != endIndex) {
        disableCursor();
        
        handleSetCursorNoBlink(i, line);
        await delay(CUROSR_MOVE_TO_SPEED);
        i += inc;
    }
}

function deleteMessage(startIndex, endIndex, line) {
    const animation_data = {
        type : "DeleteMessage",
        startIndex : startIndex,
        endIndex : endIndex,
        line : line
    }
    animations.push(animation_data);
    handleAnimations(animations);
}

function deleteCharacterInMessage(index, line) {
    // Get the character to put the cursor on
    const nthChild = $(line).children().eq(index).remove();
    cursorData.cursorElement = null;
}

async function handleDeleteMessage(startIndex, endIndex, line) {
    disableCursor();

    handleSetCursorNoBlink(startIndex, line);
    for (let i = startIndex; i >= endIndex; i--) {
        disableCursor();
        
        handleSetCursorNoBlink(i, line);
        await delay(DELETE_SPEED);
        deleteCharacterInMessage(i, line)
        handleSetCursorNoBlink(i - 1, line);
    }
}

async function handleAnimations(animations) {
    if (handlingAnimation == true) {
        return;
    }

    handlingAnimation = true;
    while (animations.length > 0) {
        // Execute function synchronously
        const animation = animations[0];

        // Type Message Handle
        switch(animation.type) {
            case "TypeMessage":
                await handleTypeMessage(animation.message, animation.index, animation.line);
                break;
            case "SetCursor":
                await handleSetCursor(animation.index, animation.line);
                break;
            case "MoveCursorTo":
                await handleMoveCursorTo(animation.startIndex, animation.endIndex, animation.line);
                break;
            case "DeleteMessage":
                await handleDeleteMessage(animation.startIndex, animation.endIndex, animation.line);
        }

        animations.splice(0, 1);
    }
    handlingAnimation = false;
}

const line = document.getElementsByClassName("banner-line");

async function main() {
    await delay(0.25);

    typeMessage("\nJackson Medina", 0, line);
    setCursor(14, line);

    await delay(2.5);

    deleteMessage(15, 0, line);
    typeMessage("\nCoder", 0, line);
    setCursor(5, line);

    await delay(3);

    deleteMessage(7, 0, line);
    typeMessage("\nDeveloper", 0, line);
    setCursor(9, line);

    await delay(3);

    deleteMessage(9, 0, line);
    setCursor(0, line);
    await delay(0.5);
    
    typeMessage("\nArtist", 0, line);
    setCursor(6, line);
    
    await delay(3);

    deleteMessage(6, 3, line);
    setCursor(2, line);
    
    await delay(0.5);
    
    moveCursorTo(2, 0, line);
    setCursor(1, line);

    await delay(0.5);

    
    
    deleteMessage(1, 1, line);
    setCursor(0, line);

    await delay(0.5);
    
    
    typeMessage("C", 1, line);
    setCursor(1, line);
    
    
    await delay(0.5);

    moveCursorTo(1, 3, line);
    setCursor(2, line);

    await delay(0.5);

    typeMessage("eator", 3, line);
    setCursor(7, line);
    /*
    moveCursorTo(11, 17, line);
    setCursor(16, line);*/
}
main();