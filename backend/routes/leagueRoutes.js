// routes/leagueRoutes.js
import { getLeagues, getTopScorers, getStandings, getFixtures } from "../controllers/leagueController.js";

const router = express.Router();

// GET /api/leagues
router.get("/", getLeagues);

// GET /api/leagues/:id/topscorers
router.get("/:id/topscorers", getTopScorers);

// GET /api/leagues/:id/standings
router.get("/:id/standings", getStandings);

// GET /api/leagues/:id/fixtures
router.get("/:id/fixtures", getFixtures);

export default router;
