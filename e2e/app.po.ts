import { browser, element, by } from 'protractor';

export class SuprematismDropdownMenuPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('supre-root h4')).getText();
  }
}
