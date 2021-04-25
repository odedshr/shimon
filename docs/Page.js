class PageList extends Array {
    constructor() {
        super(...arguments);
        this.pageMap = {};
    }
    set(pages) {
        this.length = 0;
        for (let k in this.pageMap) {
            delete this.pageMap[k];
        }
        this.push(...pages);
        this.current = pages.current;
    }
    push(...items) {
        const output = super.push(...items);
        items.forEach(page => {
            this.pageMap[page.slug] = page;
            if (page.tocSlug) {
                this.pageMap[page.tocSlug] = page;
            }
        });
        return output;
    }
    get(slug) {
        return this.pageMap[slug];
    }
    getCurrent() {
        return this.current;
    }
    setCurrent(page) {
        var _a;
        (_a = (this.getCurrent())) === null || _a === void 0 ? void 0 : _a.pageElm.removeAttribute('data-page');
        this.current = page;
        page.pageElm.setAttribute('data-page', 'current');
    }
}
export { PageList };
