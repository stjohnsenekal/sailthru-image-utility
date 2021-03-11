import fs from "fs";
import fetch from "node-fetch";
import sharp from "sharp";

const bakeImage = async (
  url,
  hasLunch,
  size,
  saveStr,
  tagStr = "",
  isLandscape = false,
  multiplier = 1, //1 for 3 col, 0.65 for 2 col
  tagBgColor = "#FFFFFF",
  tagTextColor = "#757F8C",
  tagHasFlame = false
) => {
  const width = (isLandscape ? 750 : size);
  const height = (isLandscape ? 300 : size);
  const margin = width * 0.03;

  const saveBoxSize = size * 0.21 * multiplier;
  const saveBoxPadding = saveBoxSize * 0.1 * multiplier;
  const saveFontSize = size * 0.055 * multiplier;
  const saveFontSize2 = getSaveStrSize(saveStr.length);
  const saveBoxX = width - saveBoxSize - margin;
  const saveRadius = (isLandscape ? 10 : 20) * multiplier;

  const tagFontSize = size * 0.04;
  const fontSizeWidthFactorFudge = 0.85;
  const tagBoxWidth =
    tagFontSize *
    fontSizeWidthFactorFudge *
    (tagStr.length + (tagHasFlame ? 1 : 0));
  const tagBoxHeight = tagFontSize * 1.5;
  const tagBoxMargin = margin;
  const tagBoxX = width - tagBoxWidth - tagBoxMargin;
  const tagBoxY = height - tagBoxHeight - tagBoxMargin;

  function getSaveStrSize(length) {
    if (length <= 3) {
      return size * (3.5 / (length)) * 0.055 * multiplier;
    } else if (length === 4) {
      return size * (3.5 / (length-1)) * 0.055 * multiplier;
    } else if (length === 5) {
      return size * (3.5 / (length-1.5)) * 0.055 * multiplier;
    } else if (length == 6) {
      return size * (3.5 / (length-2)) * 0.055 * multiplier;
    }
  }

  const font64 = fs
    .readFileSync("./Montserrat-Bold.ttf")
    .toString("base64");

  const fontStyle = `
    <style>
    @font-face {
        font-family: "Montserrat";
        src: url("data:application/font-woff;charset=utf-8;base64,${font64}");
    }
    </style>
  `;

  const saveFragment = `
  <rect
    x="${saveBoxX}"
    y="${-saveRadius}"
    height="${saveBoxSize + saveRadius}"
    width="${saveBoxSize}"
    fill="#E50E62"
    rx="${saveRadius}"
  />

  <text text-anchor="middle" x="${saveBoxX + saveBoxSize / 2}" y="${
    saveFontSize + saveBoxPadding
  }px" font-weight="bold" font-family="Montserrat" font-size="${saveFontSize}" fill="white">SAVE</text>

  <text text-anchor="middle" x="${saveBoxX + saveBoxSize / 2}" y="${
    saveFontSize * 2.7 + saveBoxPadding
  }px" font-weight="bold" font-family="Montserrat" font-size="${saveFontSize2}" fill="white">${saveStr}</text>
  `;

  let tagFragment = "";

  if (tagStr) {
    const flameColor = "#f5ca44";
    let flameFragment = tagHasFlame
      ? `
      <svg x="${tagBoxX + (tagFontSize / 2) * fontSizeWidthFactorFudge}" y="${
          tagBoxY + tagBoxHeight / 12
        }">
        <g
          
          transform="scale(0.045)"
        >
        <path
          fill="${flameColor}"
          d="M433 45c50 134 24 207-32 265-61 64-156 112-223 206-89 125-104 400 217 472-135-71-164-277-18-406-38 125 32 205 119 176 85-29 141 32 139 102-1 48-20 89-69 112 209-37 293-210 293-342 0-174-155-198-77-344-93 8-125 69-116 169 6 66-63 111-114 81-41-25-40-73-4-109 77-76 107-251-115-382z" />
        </g>
      </svg>
    `
      : "";

    tagFragment = `
    <rect
      x="${tagBoxX}"
      y="${tagBoxY}"
      height="${tagBoxHeight}"
      width="${tagBoxWidth}"
      fill="${tagBgColor}"
      rx="30"
      filter="url(#shadow-filter)"
    />
    
    <text x="${
      tagBoxX +
      tagBoxWidth / 2 +
      (tagHasFlame ? (tagFontSize / 2) * fontSizeWidthFactorFudge : 0)
    }" y="${
      tagBoxY + tagBoxHeight / 2
    }" fill="${tagTextColor}" text-anchor="middle" dy=".35em" font-weight="bold" font-family="Montserrat" font-size="${tagFontSize}" letter-spacing="1.1">
      ${tagStr}
    </text>

    ${flameFragment}
    `;
  }

  let lunchFragment = "";

  if (hasLunch) {
    lunchFragment = `
    <svg width="160" height="160" viewBox="0 0 48 48" fill="none">
      <path d="M23.6838 27.2914C23.415 27.2914 23.177 27.5154 23.177 27.8167C23.177 28.1179 23.415 28.3419 23.6838 28.3419C23.9527 28.3419 24.1906 28.1179 24.1906 27.8167C24.1906 27.5154 23.9527 27.2914 23.6838 27.2914Z" fill="#8BC52F"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M17.8055 7.91228C17.8055 7.40844 18.2139 7 18.7177 7H28.6515C29.1553 7 29.5637 7.40844 29.5637 7.91228V10.7873C29.5637 11.2912 29.1553 11.6996 28.6515 11.6996H26.421V14.2434C28.9657 14.7659 31.2523 16.0028 33.0693 17.737L34.1068 16.6961L34.0334 16.6218C33.6794 16.2632 33.6832 15.6856 34.0417 15.3316C34.4003 14.9777 34.9779 14.9814 35.3319 15.3399L36.751 16.7775C37.1049 17.136 37.1012 17.7137 36.7426 18.0676C36.3841 18.4216 35.8065 18.4178 35.4525 18.0593L35.3886 17.9946L34.3046 19.0823C36.2208 21.4667 37.3684 24.5079 37.3684 27.8166C37.3684 35.4547 31.2528 41.6667 23.6842 41.6667C16.1156 41.6667 10 35.4547 10 27.8166C10 24.508 11.1475 21.4669 13.0636 19.0825L11.98 17.9952L11.9167 18.0593C11.5627 18.4178 10.9851 18.4216 10.6265 18.0676C10.268 17.7137 10.2643 17.136 10.6182 16.7775L11.3094 16.0773C11.317 16.0692 11.3247 16.0612 11.3326 16.0534L11.3457 16.0406L12.0373 15.3399C12.3913 14.9814 12.9689 14.9777 13.3275 15.3316C13.686 15.6856 13.6897 16.2632 13.3358 16.6218L13.2618 16.6967L14.2989 17.7372C16.116 16.0028 18.4026 14.7659 20.9474 14.2434V11.6996H18.7177C18.2139 11.6996 17.8055 11.2912 17.8055 10.7873V7.91228ZM24.5965 11.6996H22.7719V13.9968C23.0734 13.9767 23.3776 13.9665 23.6842 13.9665C23.9908 13.9665 24.295 13.9767 24.5965 13.9968V11.6996ZM30.7115 20.6984C31.07 21.0524 31.0737 21.63 30.7198 21.9885L25.8427 26.929C25.954 27.2036 26.0152 27.5035 26.0152 27.8167C26.0152 29.1033 24.9825 30.1665 23.6838 30.1665C22.3852 30.1665 21.3524 29.1033 21.3524 27.8167C21.3524 26.53 22.3852 25.4668 23.6838 25.4668C23.9928 25.4668 24.2867 25.527 24.5552 25.6361L29.4213 20.7067C29.7753 20.3482 30.3529 20.3444 30.7115 20.6984Z" fill="#8BC52F"/>
    </svg>
    `;
  }

  const svg = `
  <svg
    viewBox="0 0 ${width} ${height}"
    version="1.1"
    baseProfile="full"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <filter x="-50%" y="-50%" width="200%" height="200%" filterUnits="objectBoundingBox" id="shadow-filter">
        <feOffset dx="0" dy="4" in="SourceAlpha" result="shadowOffsetOuter1"/>
        <feGaussianBlur stdDeviation="10" in="shadowOffsetOuter1" result="shadowBlurOuter1"/>
        <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.2 0" in="shadowBlurOuter1" type="matrix" result="shadowMatrixOuter1"/>
        <feMerge>
          <feMergeNode in="shadowMatrixOuter1"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    ${fontStyle}
    <rect
      x="0"
      y="0"
      height="${height}"
      width="${width}"
      fill="transparent"
    />
  
    ${saveFragment}
    ${tagFragment}
    ${lunchFragment}
  </svg>
  `;

  const response = await fetch(url);
  const data = await response.buffer();

  return sharp(data)
    .resize(width, height)
    .composite([
      {
        input: Buffer.from(svg),
        blend: "over",
      },
    ])
    .png()
    .toBuffer();
};

export default bakeImage;
