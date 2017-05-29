import { UserPermissionPage } from './app.po';

describe('user-permission App', () => {
  let page: UserPermissionPage;

  beforeEach(() => {
    page = new UserPermissionPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
