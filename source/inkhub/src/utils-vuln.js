function isValidHexColor(color) {
    // IMPORTANT: The root cause of the CSS injection is the predicate "color.length < 7" which should be "color.length !== 7"
    const hexPattern = /^[0-9A-Fa-f]{6}$/;
    return color == null || typeof color !== 'string' || color.length < 7 || color[0] !== '#' || hexPattern.test(color.slice(1, 7));
}

module.exports = {isValidHexColor};
