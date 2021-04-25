import { PageList } from './Page.js';

function getCurrentPageId(): string {
  return location.hash.substr(1) || 'page-1';
}

function getPageByLocation(pages: PageList) {
  return pages.get(getCurrentPageId()) || pages[0];
}

function updateLocation(newPageHash: string) {
  location.hash = newPageHash;
}

export { getPageByLocation, getCurrentPageId, updateLocation }