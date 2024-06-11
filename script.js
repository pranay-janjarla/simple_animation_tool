function renderHTML() {
    const htmlInput = document.getElementById('html-input').value;
    const renderedHTML = document.getElementById('rendered-html');
    renderedHTML.innerHTML = htmlInput;
}

function addAnimationType() {
    const animationType = document.getElementById('animation-type').value;
    const selectedAnimationsContainer = document.getElementById('selected-animations-container');
    
    const animationDiv = document.createElement('div');
    animationDiv.classList.add('animation');
    animationDiv.innerHTML = `
        <h3>${capitalizeFirstLetter(animationType)}</h3>
        <label>From:</label>
        <input type="text" class="from-value" data-animation-type="${animationType}" placeholder="e.g., 1 for scale, 0deg for rotate">
        <label>To:</label>
        <input type="text" class="to-value" data-animation-type="${animationType}" placeholder="e.g., 1.5 for scale, 45deg for rotate">
    `;
    selectedAnimationsContainer.appendChild(animationDiv);
}

function applyAnimation() {
    const elementSelector = document.getElementById('element-selector').value;
    const fromValues = document.querySelectorAll('.from-value');
    const toValues = document.querySelectorAll('.to-value');

    if (!elementSelector) {
        alert("Please enter a CSS selector.");
        return;
    }

    const styleSheet = document.styleSheets[0];
    let fromTransforms = '';
    let toTransforms = '';
    let keyframes = `@keyframes customAnimation { from { `;
    let toKeyframes = 'to {';

    fromValues.forEach((fromValue, index) => {
        const animationType = fromValue.getAttribute('data-animation-type');
        const toValue = toValues[index].value;

        if (animationType === 'opacity') {
            keyframes += `opacity: ${fromValue.value}; `;
            toKeyframes += `opacity: ${toValue}; `;
        } else {
            fromTransforms += `${getTransform(animationType, fromValue.value)} `;
            toTransforms += `${getTransform(animationType, toValue)} `;
        }
    });

    if (fromTransforms) {
        keyframes += `transform: ${fromTransforms.trim()}; `;
        toKeyframes += `transform: ${toTransforms.trim()}; `;
    }

    keyframes += `} ${toKeyframes} }`;
    const cssCode = `
        ${elementSelector}:hover {
            animation: customAnimation 0.5s forwards;
        }
    `;

    // Insert the keyframes into the stylesheet
    styleSheet.insertRule(keyframes, styleSheet.cssRules.length);

    // Insert the hover effect rule into the stylesheet
    styleSheet.insertRule(cssCode, styleSheet.cssRules.length);

    // Display the generated CSS code
    document.getElementById('css-code').textContent = keyframes + '\n' + cssCode;
}

function getTransform(animationType, value) {
    switch (animationType) {
        case 'scale':
            return `scale(${value})`;
        case 'rotate':
            return `rotate(${value}deg)`;
        case 'translateX':
            return `translateX(${value}px)`;
        case 'translateY':
            return `translateY(${value}px)`;
        default:
            return '';
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
