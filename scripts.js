let expandingTexts = document.getElementsByClassName('expand-on-scroll');
for (let i = 0; i < expandingTexts.length; ++i) {
    let element = expandingTexts[i];
    let textAlign = window.getComputedStyle(element).textAlign;
    if (textAlign === 'center') {
        element.style.transformOrigin = "50% 50%";
    } else {
        element.style.transformOrigin = "0 50%";
    }
    window.addEventListener("scroll", function(event) {        
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
