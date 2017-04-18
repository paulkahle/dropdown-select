import { SuprematismDropdownMenuPage } from './app.po';

describe('SuprematismDropdownMenu App', function() {
  let page: SuprematismDropdownMenuPage;

  beforeEach(() => {
    page = new SuprematismDropdownMenuPage();
  });

  it('should display page header', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Trigger');
  });
});
