async function importSVG(src: string): Promise<HTMLElement | null> {
  const response = await fetch(src);
  const data = await response.text();

  try {
    return (new DOMParser()).parseFromString(data, 'image/svg+xml').firstChild as HTMLElement || null;
  }
  catch (err) {
    console.error(err);
  }
  return null;
}

async function embedSVG(imgElm: HTMLImageElement) {
  const svgElm: HTMLElement | null = await importSVG(imgElm.src);

  if (svgElm !== null && imgElm.parentNode) {
    [...imgElm.classList.values()].forEach(item => svgElm.classList.add(item));

    imgElm.parentNode.replaceChild(svgElm, imgElm);
  }

  return svgElm;
}

function embedAllSVGs() {
  const svgImages = Array.from(document.querySelectorAll('img[data-svg="embed"]'));
  return Promise.all(svgImages.map(elm => embedSVG(elm as HTMLImageElement)));
}

export { embedAllSVGs };