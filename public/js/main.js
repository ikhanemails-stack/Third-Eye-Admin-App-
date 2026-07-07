// Third Eye Computer Solutions - License Manager
// Main application bootstrap and routing.

const App = {
  admin: null,

  async boot() {
    try {
      this.admin = await Api.get('/auth/me');
    } catch (err) {
      this.admin = null;
    }

    if (!this.admin) {
      LoginScreen.render();
      return;
    }

    this.registerRoutes();
    Router.start();
  },

  registerRoutes() {
    Router.register('/dashboard', () => DashboardScreen.render());
    Router.register('/clients', () => ClientsScreen.render());
    Router.register('/account', () => AccountScreen.render());
  }
};

document.addEventListener('DOMContentLoaded', () => {
  App.boot();
});
