import express from "express";
import iniApp from "./src/iniApp.js";
const app = express();

iniApp(app, express);
