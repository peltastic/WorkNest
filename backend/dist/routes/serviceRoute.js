"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const servicesController_1 = require("../controllers/servicesController");
router.get("/getServices", servicesController_1.listArtisans);
router.get("/get-services/:id", servicesController_1.getArtisanById);
exports.default = router;
