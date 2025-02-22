import express from "express";

const router = express.Router();

import {getArtisanById, listArtisans} from "../controllers/servicesController"

router.get(
    "/getServices",
    listArtisans
)

router.get(
    "/get-services/:id",
    getArtisanById
)


export default router
