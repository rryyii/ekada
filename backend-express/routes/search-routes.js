import express from 'express';

const router = express.Router();

router.get("/api/search/:team", async (req, res) => {
    const teamName = req.params.team;

})


export default router;