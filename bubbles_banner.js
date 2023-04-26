function makeSVGElement(tag, attrs) {
    var element = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (let key in attrs) {
        element.setAttribute(key, attrs[key])
    }
    return element;
}

// Use 2 pages
function addBubbles(count, layers) {
    const pages = 2;
    // Fill page with bubbles
    const MAX_HEIGHT = 2220;
    const MAX_WIDTH = 1440;
    const ANIMATION_TIME = 60;

    const MAX_RADIUS = 20;
    const MIN_RADIUS = 10;

    const MAX_Y_RAND = 200;
    const MAX_X_RAND = 200;

    for (let k = 0; k < pages; k++) {
        let page = makeSVGElement("g", {"transform" : `translate(${0}, ${MAX_HEIGHT})`});

        let begin="0s";
        
        if (k > 0) {
            let anim_time = (ANIMATION_TIME * k) / 2;
            let blobPathAnimationDelay = makeSVGElement("animateTransform",
            {
                id: `delay_${k}`,
                dur:`${anim_time}s`,
                begin: `0; move_${k}.end`,
                type:"translate",
                attributeType:"XML",
                attributeName:"transform",
            });
            begin = `delay_${k}.end;`
            page.append(blobPathAnimationDelay);
        }
        let blobPathAnimation = makeSVGElement("animateMotion",
        {
            id: `move_${k}`,
            begin: begin,
            dur:`${ANIMATION_TIME}s`,
            repeatCount:"indefinite", 
            restart:"always",
            path:`M0 0 L0 -${2*MAX_HEIGHT} z`,
            keyPoints:"0;0.5;1",
            keyTimes:"0;1;1",
            calcMode:"linear",
            fill:"freeze"
        });
        // Move page of blobs
        page.append(blobPathAnimation);
    
    
        for (let j = 0; j < layers; j++) {
            for(let i = 0; i < count; i++) {
                let start_x = (MAX_WIDTH / count) * (i + 0.5) + (Math.random()-0.5) * MAX_X_RAND;
                let start_y = (MAX_HEIGHT / layers) * (j + 0.5) + (Math.random()-0.5) * MAX_Y_RAND;
                
                let radius = Math.random()*(MAX_RADIUS - MIN_RADIUS) + MIN_RADIUS;

                let blob = makeSVGElement("circle", 
                {
                    "fill" : "FF0066",
                    "cx" : start_x,
                    "cy" : start_y,
                    "r" : radius
                });
    
                page.append(blob);
            }
        }
        document.getElementsByClassName("blurred-group")[0].appendChild(page);
    }
}

addBubbles(10, 10, 2);
