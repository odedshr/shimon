var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function importSVG(src) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(src);
        const data = yield response.text();
        try {
            return (new DOMParser()).parseFromString(data, 'image/svg+xml').firstChild || null;
        }
        catch (err) {
            console.error(err);
        }
        return null;
    });
}
function embedSVG(imgElm) {
    return __awaiter(this, void 0, void 0, function* () {
        const svgElm = yield importSVG(imgElm.src);
        if (svgElm !== null && imgElm.parentNode) {
            [...imgElm.classList.values()].forEach(item => svgElm.classList.add(item));
            imgElm.parentNode.replaceChild(svgElm, imgElm);
        }
        return svgElm;
    });
}
function embedAllSVGs() {
    const svgImages = Array.from(document.querySelectorAll('img[data-svg="embed"]'));
    return Promise.all(svgImages.map(elm => embedSVG(elm)));
}
export { embedAllSVGs };
