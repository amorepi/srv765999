import express from "express";
import mongoose from "mongoose";
import { layout } from "../layout.js";
import { verifyConnection } from "../utils/mailerUtils.js";
import { 
  viewTodo, viewTags, viewStructure, showDestroyForm, confirmDestroyAll,
  sim400, sim500, logPm2, logNode, logNginx, sendTestEmail 
} from "../controllers/toolsContr.js";

const router = express.Router();

router.get('/health', async (req, res) => {
  const currentVersion = req.app.get('version') || 'v1.0.00';
  const currentUser = req.currentUser || null;
  let statusSystem = "UP", dbStatus = "OK", mailStatus = "OK";

  if (mongoose.connection.readyState !== 1) { statusSystem = "DEGRADED"; dbStatus = "DOWN"; }
  if (!(await verifyConnection())) { statusSystem = "DEGRADED"; mailStatus = "DOWN"; }

  if (statusSystem === "DEGRADED") {
    console.error(`[HEALTH_CHECK_FAIL] Servizi degradati. DB: ${dbStatus}, SMTP: ${mailStatus}`);
    return res.status(502).json({ status: "DEGRADED", version: currentVersion, database: dbStatus, mailer: mailStatus });
  }

  const healthContent = `
    <div class="row justify-content-center mt-5"><div class="col-12 col-md-8 col-lg-6 text-center"><div class="p-5 bg-white border rounded shadow-sm">
      <div class="d-inline-flex p-3 bg-success-subtle text-success rounded-circle mb-4"><span class="fs-1 fw-bold">✓</span></div>
      <h2 class="fw-bold text-dark mb-2">Health Check Passato</h2>
      <p class="text-secondary mb-4">Il motore applicativo Node.js risponde correttamente, la connessione al Database è attiva e il modulo Mailer è autenticato.</p>
      <div class="d-flex gap-2 justify-content-center"><a href="/dashboard" class="btn btn-secondary px-4">Torna al Pannello</a></div>
    </div></div></div>`;
  
  return res.status(200).send(layout({ content: healthContent, user: currentUser, version: currentVersion }));
});

router.get('/destroyAllUsers', showDestroyForm);
router.post('/destroyAllUsers', confirmDestroyAll);
router.get('/log-pm2', logPm2);
router.get('/log-node', logNode);
router.get('/log-nginx', logNginx);
router.get('/Structure', viewStructure);
router.get('/view-todo', viewTodo);
router.get('/view-tags', viewTags);
router.get('/sim-400', sim400);
router.get('/sim-500', sim500);
router.get('/send-test-email', sendTestEmail);

export default router;
