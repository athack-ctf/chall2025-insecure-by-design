function isValidHexColor(color) {
    // IMPORTANT: The root cause of the CSS injection is the predicate "color.length < 7" which should be "color.length !== 7"
    const hexNumberPattern = /^[0-9A-Fa-f]+$/;
    return !(color == null || typeof color !== 'string' || color.length < 7 || color[0] !== '#' || hexNumberPattern.test(color.slice(0, 7)));
}

module.exports = {isValidHexColor};
