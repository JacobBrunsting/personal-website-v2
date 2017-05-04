function runExpandingText() {
    let expandingTexts = document.getElementsByClassName('expand-on-scroll');
    for (let i = 0; i < expandingTexts.length; ++i) {
        let element = expandingTexts[i];
        let textAlign = window.getComputedStyle(element).textAlign;
        if (textAlign === 'center') {
            element.style.transformOrigin = "50% 50%";
        } else {
            element.style.transformOrigin = "0 50%";
        }
        window.addEventListener("scroll", function (event) {
            let elementBoundingRect = element.getBoundingClientRect();
            let elementDistToTop = elementBoundingRect.top;
            let elementHeight = elementBoundingRect.height;
            let elementPercentScrolled = elementDistToTop / window.innerHeight;
            let percentToExpand = ((0.5 - Math.abs(elementPercentScrolled - 0.2)) - 0.3) * 0.6;
            if (percentToExpand < 0) {
                percentToExpand = 0;
            } else if (percentToExpand > 0.08) {
                percentToExpand = 0.08;
            }
            let scale = 1 + percentToExpand;
            element.style.transform = "scale(" + scale + ", " + scale + ")";
        });
    }
}

function runSplashAnimation() {
    const animCanvas = document.getElementsByClassName('animation-canvas')[0];
    const ctx = animCanvas.getContext("2d");
    const lines = [];

    const TIME_BETWEEN_FRAMES = 0.06; // seconds
    const LINE_COLOR = "#222222";
    const BACKGROUND_COLOR = "#efefef";
    const MAX_Y = animCanvas.height;
    const MIN_Y = 0;
    const MAX_X = animCanvas.width;
    const MIN_X = 0;
    const MIN_SPACING = 10;
    const MAX_SPACING = 30;
    const MIN_HEIGHT = 200;
    const MAX_HEIGHT = 300;
    const LINE_WIDTH = 2;
    const MAX_ROTATION_V = 0.1;
    const MIN_ROTATION_V = 0.03;
    const GRAVITY = 0.2;
    const MAX_MASS = 2;
    const MIN_MASS = 0.5;
    const AIR_RESIST = 0.98;
    const LINE_START_X = 120;
    const LINE_END_X = MAX_X - 120;
    const BALL_RAD = 4;
    const LINE_OFFSET = 5;

    let curLinePos = LINE_START_X;
    while (true) {
        curLinePos += (MAX_SPACING - MIN_SPACING) * Math.random() + MIN_SPACING;
        if (curLinePos > LINE_END_X) {
            break;
        }
        const height = (MIN_HEIGHT - MAX_HEIGHT) * Math.random() + MIN_HEIGHT;
        const rotationVelocity = (Math.random() * (MAX_ROTATION_V - MIN_ROTATION_V) + MIN_ROTATION_V) * (Math.random() > 0.5 ? 1 : -1);
        const mass = (MAX_MASS - MIN_MASS) * Math.random() + MIN_MASS;

        lines.push({
            x: curLinePos,
            y: MIN_Y,
            height: height,
            width: LINE_WIDTH,
            rotation: 0,
            rotationVelocity: rotationVelocity,
            mass: mass
        });
    }

    function runPhysics() {
        for (let i = 0; i < lines.length; ++i) {
            let curLine = lines[i];
            curLine.rotation += curLine.rotationVelocity;
            const ROT_FORCE = -Math.sin(curLine.rotation) * GRAVITY;
            const ROT_ACCEL = ROT_FORCE / curLine.mass;
            curLine.rotationVelocity += ROT_ACCEL;
            curLine.rotationVelocity *= AIR_RESIST;
        }
    }

    function drawLines() {
        ctx.fillStyle = BACKGROUND_COLOR;
        ctx.beginPath();
        ctx.rect(MIN_X, MIN_Y, MAX_X, MAX_Y);
        ctx.fill();

        ctx.fillStyle = LINE_COLOR;
        for (let i = 0; i < lines.length; ++i) {
            let curLine = lines[i];
            ctx.translate(curLine.x, curLine.y);
            ctx.rotate(curLine.rotation);
            ctx.fillRect(0, -LINE_OFFSET, curLine.width, curLine.height);
            ctx.fillRect(-BALL_RAD + (curLine.width / 2), curLine.height - LINE_OFFSET, BALL_RAD * 2, BALL_RAD * 2);
            ctx.rotate(-curLine.rotation);
            ctx.translate(-curLine.x, -curLine.y);
        }
    }

    setInterval(function () {
        runPhysics();
        drawLines();
    }, TIME_BETWEEN_FRAMES * 1000);
}


function scrollToElement(id) {
    location.href = "#";
    location.href = `#${id}`;
};

function setupNav() {
    const navTargetElements = document.getElementsByClassName("in-nav");
    let navElementsInfo = [];
    for (let i = 0; i < navTargetElements.length; ++i) {
        const element = navTargetElements[i];
        navElementsInfo.push({
            title: element.dataset.navTitle,
            scrollId: element.id
        });
    }
   
    let resultingHtml = "";
    for (let i = 0; i < navElementsInfo.length; ++i) {
       let navElementInfo = navElementsInfo[i];
       resultingHtml += `
            <li>
               <button onclick=scrollToElement(\'${navElementInfo.scrollId}\')>
                   ${navElementInfo.title}
               </button>
            </li>
            `;
    }
    document.getElementById("nav-list").innerHTML = resultingHtml;
}

runExpandingText();
setupNav();
// runSplashAnimation();
