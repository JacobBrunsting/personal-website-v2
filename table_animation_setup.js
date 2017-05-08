const ROW_ANIMATION_DURATION = 250;
const ANIMATION_ACCELERATION_EXPONENT = 1 / 2;
const ANIMATION_EQUATION_DENOMINATOR = 2 * Math.pow(0.5, ANIMATION_ACCELERATION_EXPONENT);
var currentlyAnimating = false;

function invertHeaderSorting(header, animate) {
    if (currentlyAnimating) {
        return;
    }
    currentlyAnimating = true;
    var table = document.getElementById("transcript_table").children[0];
    var rows = [];
    var rowHeights = [];
    const numLoops = table.children.length - 1;
    for (var i = 0; i < numLoops; i++) {
        rows[i] = table.children[i + 1];
        rowHeights[i] = rows[i].offsetHeight;
    }
    var firstTableRow = table.firstChild;
    var tableHeaders = firstTableRow.children;
    var selectedHeaderCell = tableHeaders[header].children[0];
    var selectedHeaderCellArrows = selectedHeaderCell.children[1];
    var cellsAtRowHeaderIntersect = [];
    for (var i = 0; i < rows.length; ++i) {
        cellsAtRowHeaderIntersect.push(rows[i].children[header].children[0].textContent);
    }
    var oldArray = cellsAtRowHeaderIntersect.slice(0);
    if (selectedHeaderCellArrows.className == "arrows sorted_up") {
        cellsAtRowHeaderIntersect.sort(reverseCellComparator);
        selectedHeaderCellArrows.className = "arrows sorted_down";
    }
    else {
        cellsAtRowHeaderIntersect.sort(cellComparator);
        selectedHeaderCellArrows.className = "arrows sorted_up";
    }
    for (var i = 0; i < tableHeaders.length; i++) {
        if (i != header) {
            tableHeaders[i].children[0].children[1].className = "arrows neutral";
        }
    }
    var originalPositions = [];
    var rowShifts = [];
    for (var i = 0; i < oldArray.length; ++i) {
        for (var n = 0; n < cellsAtRowHeaderIntersect.length; ++n) {
            if (oldArray[i] == cellsAtRowHeaderIntersect[n]) {
                cellsAtRowHeaderIntersect[n] = null; // to avoid duplicates
                originalPositions[n] = i;
                rowShifts[i] = n - i;
                break;
            }
        }
    }
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
    table.appendChild(firstTableRow);
    for (var i = 0; i < rows.length; ++i) {
        const row = rows[originalPositions[i]];
        table.appendChild(row);
        var posChange = i - originalPositions[i];
        var rowShiftAmount = sum(rowHeights, i, originalPositions[i]);
        if (rowShiftAmount > 0) {
            rowShiftAmount -= rowHeights[i];
        }
        else {
            rowShiftAmount += rowHeights[i];
        }
        if (animate) {
            for (var n = 0; n < 3; n++) {
                var callback = null;
                if (n == 0) {
                    callback = function () {
                        currentlyAnimating = false;
                    }
                }
                animatePosChange(rowShiftAmount, row.children[n].children[0], callback);
            }
        }
        else {
            currentlyAnimating = false;
        }
    }
}
// returns the negative if firstindex is larger than last index
function sum(list, firstIndex, lastIndex) {
    var negate = false;
    if (firstIndex > lastIndex) {
        var temp = firstIndex;
        firstIndex = lastIndex;
        lastIndex = temp;
        negate = true;
    }
    var total = 0;
    for (var i = firstIndex; i <= lastIndex; ++i) {
        total += list[i];
    }
    if (negate) {
        total *= -1;
    }
    return total;
}

function animatePosChange(yChange, element, onComplete) {
    console.log("animating position change");
    var id = setInterval(animate, 16)
    var frameCount = Math.round(ROW_ANIMATION_DURATION / 16.0);
    var framesComplete = 0;
    var currentTop = Math.round(yChange).toString() + "px";
    element.style.top = currentTop;

    function animate() {
        var offset;
        if (framesComplete >= frameCount) {
            clearInterval(id);
            if (onComplete) {
                onComplete();
            }
            offset = 0;
        }
        else {
            var percentDone = framesComplete / frameCount;
            var changePercentage;
            if (percentDone >= 0.5) {
                changePercentage = Math.pow(percentDone - 0.5, ANIMATION_ACCELERATION_EXPONENT) / ANIMATION_EQUATION_DENOMINATOR + 0.5;
            }
            else {
                changePercentage = -Math.pow(0.5 - percentDone, ANIMATION_ACCELERATION_EXPONENT) / ANIMATION_EQUATION_DENOMINATOR + 0.5;
            }
            offset = yChange * (1 - changePercentage);
            framesComplete++;
        }
        currentTop = Math.round(offset).toString() + "px";
        element.style.top = currentTop;
    }
}

function positionOfString(string, array) {
    for (var i = 0; i < array.length; ++i) {
        if (array[i] == string) {
            return i;
        }
    }
    return -1;
}

function cellComparator(a, b) {
    const intVal1 = parseInt(a);
    const intVal2 = parseInt(b);
    if (!isNaN(intVal1) && isNaN(intVal2)) {
        return -1;
    }
    else if (isNaN(intVal1) && !isNaN(intVal2)) {
        return 1;
    }
    else if (!isNaN(intVal1)) {
        return b - a;
    }
    return a.localeCompare(b);
}

function reverseCellComparator(a, b) {
    return cellComparator(b, a);
}

function setupTableSorting() {
    var isMobile = false;
    if (window.matchMedia("(max-width: 780px), and (max-device-width: 780px)").matches) {
        isMobile = true;
    }
    var headers = document.getElementsByClassName("transcript_header");
    for (var i = 0; i < headers.length; ++i) {
        const headerNum = i;
        headers[i].addEventListener("click", function () {
            invertHeaderSorting(headerNum, !isMobile)
        })
    }
}
setupTableSorting();
invertHeaderSorting(0, false);
