// File completo: backend/controllers/authContr.js
import { layout } from "../layout.js";

export const authContr = {
  /**
   * Mostra il form di login se l'utente non è autenticato
   */
  showLogin: (req, res) => {
    res.clearCookie('user_session');

    const loginForm = `
      <div class="row justify-content-center mt-5">
        <div class="col-12 col-sm-8 col-md-6 col-lg-4">
          <div class="card shadow-sm border-0 p-4">
            <h3 class="text-center mb-4 fw-bold">Accedi al Sistema</h3>
            <form action="/login" method="POST">
              <div class="mb-3">
                <label class="form-label small fw-bold">Username</label>
                <input type="text" name="username" class="form-control" required placeholder="Inserisci username">
              </div>
              <div class="mb-4">
                <label class="form-label small fw-bold">Password</label>
                <input type="password" name="password" class="form-control" required placeholder="Inserisci password">
              </div>
              <button type="submit" class="btn btn-primary w-100 py-2">Invia</button>
            </form>
          </div>
        </div>
      </div>
    `;
    
    const currentVersion = req.app.get('version') || 'v1.1.00';
    return res.send(layout({ content: loginForm, user: null, version: currentVersion }));
  },

  /**
   * Elabora le credenziali di accesso rigide
   */
  processLogin: (req, res) => {
    const { username, password } = req.body;

    if (username === 'admin' && password === process.env.ADMIN_PASS) {
      res.cookie('user_session', JSON.stringify({ name: 'Admin' }), { 
        maxAge: 36000000, 
        httpOnly: true,
        path: '/' 
      });
      return res.redirect('/');
    }

    return res.send('<script>alert("Credenziali errate!"); window.location.href="/login";</script>');
  },

  /**
   * Effettua il logout distruggendo il cookie di sessione
   */
  logout: (req, res) => {
    res.clearCookie('user_session');
    return res.redirect('/');
  }
};
