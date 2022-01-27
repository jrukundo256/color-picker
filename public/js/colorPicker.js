let hexValue = "#30a8ff";
let rgb = {r:48, g:168, b:255};

const getSpectrumWrapper    = () => document.querySelector(".spectrum-wrapper");
const getColorPickerWrapper = () => document.querySelector(".picker-wrapper");

/**
 * Defining the various spectrum ranges;
 * Red      - Yellow
 * Yellow   - Green
 * Green    - Cyan
 * Cyan     - Blue
 * Blue     - Magenta
 * Magenta  - Red
 */
const spectrumRanges = [
{ from: [255, 0, 0], to: [255, 255, 0] },
{ from: [255, 255, 0], to: [0, 255, 0] },
{ from: [0, 255, 0], to: [0, 255, 255] },
{ from: [0, 255, 255], to: [0, 0, 255] },
{ from: [0, 0, 255], to: [255, 0, 255] },
{ from: [255, 0, 255], to: [255, 0, 0] }
];

const findColorValue = (from, to, leftDistRatio) => {
  return Math.round(from + (to - from) * leftDistRatio);
};


/**
 *  Find and return rgb values from the mouse click position
 */
 const findRgbFromMousePosition = (event) => {
    const { left, width } = getSpectrumWrapper().getBoundingClientRect();
    const leftDistance = event.clientX - left;

    if (leftDistance < 0) { leftDistance = 0; }
    else if (leftDistance >= width) { leftDistance = (width - 1); }

    const rangeWidth = width / spectrumRanges.length;
    const includedRange = Math.floor(leftDistance / rangeWidth);
    const leftDistRatio = ((leftDistance % rangeWidth) / rangeWidth).toFixed(2);
    const { from, to } = spectrumRanges[includedRange];
    
    return {
      r: findColorValue(from[0], to[0], leftDistRatio),
      g: findColorValue(from[1], to[1], leftDistRatio),
      b: findColorValue(from[2], to[2], leftDistRatio)
  };

};


const darken = (color, ratio) => Math.round((1 - ratio) * color);
const whiten = (color, ratio) => Math.round(color + (255 - color) * ratio);

const adjustSaturation = ({ r, g, b }) => (ratio, adjustmentFn) => {
    return {
      r: adjustmentFn(r, ratio),
      g: adjustmentFn(g, ratio),
      b: adjustmentFn(b, ratio)
  };
}


/** Add Saturation to the RGB values
*/
const saturate = (rgb, e) => {
    const { top, height } = getColorPickerWrapper().getBoundingClientRect();
    const topDistance = Math.min(Math.max(e.clientY - top, 0), height);
    const topDistRatio = (topDistance / height).toFixed(2);

    if (topDistRatio > 0.8) {
      const darknessRatio = (topDistRatio - 0.8) / 0.5;
      return adjustSaturation(rgb)(darknessRatio, darken);
  }

  if (topDistRatio < 0.5) {
      const whitenessRatio = (0.5 - topDistRatio) / 0.5;
      return adjustSaturation(rgb)(whitenessRatio, whiten);
  }

  return rgb;
}


/** Convert RGB values into HEX
*/
const rgbToHex = (r, g, b) => {
    const toHex = (rgb) => {
      let hex = Number(rgb).toString(16);
      if (hex.length < 2) {
        hex = `0${hex}`;
    }
    return hex;
};
const red = toHex(r);
const green = toHex(g);
const blue = toHex(b);
return `#${red}${green}${blue}`;
};


  /**
   * Listen in for clicks on the spectrum
   * On clicking on the spectrum, the color on the picker is updates
   */
   getSpectrumWrapper().addEventListener("mousedown", (e) => {
    rgb = findRgbFromMousePosition(e);
    hexValue = rgbToHex(rgb.r, rgb.g, rgb.b);

    // Set Color on the picker wrapper
    document.querySelector(".picker-wrapper").style.background = hexValue;
});


/**
   * Listen in for clicks on the color picker area
   * On clicking on the color picker wrapper area, 
   * the selected color is displayed in the left hand box just as intended
   */

   getColorPickerWrapper().addEventListener("mousedown", (e) => {
      const { r, g, b } = saturate(rgb, e);
      const hexValue2 = rgbToHex(r, g, b);

      document.querySelector(".display-wrapper").style.background = hexValue2;
      document.querySelector(".hex").innerText = hexValue2;
  });