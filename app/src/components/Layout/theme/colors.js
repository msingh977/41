import { hsl, parseToHsl } from "polished";
import { createContext } from "react";

const limitNumber = num => Math.max(Math.min(num, 1), 0);

const getRampFromColor = (color, inflection = 60, sat = 1, lum = 1) => {
	// First get hue from color:
	const { hue, saturation, lightness } = parseToHsl(color);

	// Than use HSL colors to create a ramp:
	return {
		10: hsl(
			hue,
			limitNumber((saturation - 0.4) * sat),
			limitNumber(0.96 * lum)
		),
		20: hsl(
			hue,
			limitNumber((saturation - 0.35) * sat),
			limitNumber((lightness + (0.96 - lightness) * 0.8) * lum)
		),
		30: hsl(
			hue,
			limitNumber((saturation - 0.3) * sat),
			limitNumber((lightness + (0.96 - lightness) * 0.6) * lum)
		),
		40: hsl(
			hue,
			limitNumber((saturation - 0.25) * sat),
			limitNumber((lightness + (0.96 - lightness) * 0.4) * lum)
		),
		50: hsl(
			hue,
			limitNumber((saturation - 0.1) * sat),
			limitNumber((lightness + (0.96 - lightness) * 0.2) * lum)
		),
		60: hsl(hue, limitNumber(saturation * sat), limitNumber(lightness * lum)),
		70: hsl(
			hue,
			limitNumber((saturation - 0.01) * sat),
			limitNumber((0.18 + (lightness - 0.18) * 0.8) * lum)
		),
		80: hsl(
			hue,
			limitNumber((saturation - 0.06) * sat),
			limitNumber((0.18 + (lightness - 0.18) * 0.5) * lum)
		),
		90: hsl(
			hue,
			limitNumber((saturation - 0.21) * sat),
			limitNumber((0.18 + (lightness - 0.18) * 0.2) * lum)
		),
		100: hsl(
			hue,
			limitNumber((saturation - 0.38) * sat),
			limitNumber(0.18 * lum)
		),
		inflection
	};
};

const getGrayRamp = (inflection = 60) => {
	return {
		10: hsl(0, 0, 0.97),
		20: hsl(0, 0, 0.94),
		30: hsl(0, 0, 0.9),
		40: hsl(0, 0, 0.83),
		50: hsl(0, 0, 0.74),
		60: hsl(0, 0, 0.61),
		70: hsl(0, 0, 0.49),
		80: hsl(0, 0, 0.39),
		90: hsl(0, 0, 0.3),
		100: hsl(0, 0, 0.23),
		inflection
	};
};

const themeRamp = getRampFromColor("#005E8E");
const dangerRamp = getRampFromColor("#DC0018");
const warningRamp = getRampFromColor("#E75E00");
const successRamp = getRampFromColor("#00813A");
const grayRamp = getGrayRamp();

const brandColor = themeRamp[60];
const focusColor = themeRamp[40];
const statusColors = {
  critical: dangerRamp[60],
  error: dangerRamp[60],
  warning: warningRamp[60],
  ok: successRamp[60],
  unknown: grayRamp[60],
  disabled: grayRamp[60],
};

const designColors = {
	venetianRed: "#DC0018",
	red: "#F7001D",
	cerulean: "#006699",
	solitude: "#E7EDEF",
	clearDay: "#F2F7F9",
	mocassin: "#FFFAB2",
	success: "#dff0d8",
	pattensBlue: "#D8E8EF",
	malibu: "#66AFE9",
	black: "#000000",
	nightRider: "#333333",
	coal: "#454545",
	empress: "#757575",
	silver: "#CCCCCC",
	lightGrey: "#D5D5D5",
	gainsboro: "#E5E5E5",
	smoke: "#F5F5F5",
	white: "#FFFFFF"
};

const ColorRampContext = createContext({
	theme: themeRamp,
	danger: dangerRamp,
	warning: warningRamp,
	success: successRamp,
	gray: grayRamp
});

export {
	getRampFromColor,
	getGrayRamp,
	themeRamp,
	dangerRamp,
	warningRamp,
	successRamp,
	grayRamp,
	brandColor,
	focusColor,
	statusColors,
	designColors,
	ColorRampContext
};