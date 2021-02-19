function getHashChangeHandler(pages, setPage) {
    const pageMap = pages.reduce((map, page) => { map[page.name] = page; return map; }, {});
    return () => {
        const page = pageMap[location.hash.substr(1)];
        if (page) {
            setPage(page);
        }
    };
}
export { getHashChangeHandler };
