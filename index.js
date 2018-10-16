import http from 'http';
import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import items from './items';

let started = false;
let app = express();
var results = {};
app.server = http.createServer(app);
let matchingBabies = ['rod-son', "tony-daughter", 'nolan', 'ye', 'ye-son', 'mark', 'linyan', 'kevin-son', 'james', 'kevin-son', 'kevin', 'aly'];

// logger
app.use(morgan('dev'));

// // 3rd party middleware
// app.use(cors({
// 	exposedHeaders: config.corsHeaders
// }));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors({
	exposedHeaders: ["Link"]
}));

let router = express.Router();
router.get("/", (req, res) => {
	res.json(results);
});
router.post("/", (req, res) => {
	console.log(req.body);
	var guesses = req.body.items;
	var babies = req.body.babies;
	var itemResults = guesses.map((item, i) => {
		var matchingItem = items.find(it => it.id === item.id);
		return {
			id: item.id,
			price: matchingItem.price,
			guess: guesses[i].price
		};
	});
	var babyResults = babies.map(baby => {
		return {
			id: baby.id,
			guess: baby.guess,
			baby: matchingBabies[baby.id],
			correct: matchingBabies[baby.id] === baby.guess
		};
	});
	results[req.body.name] = {
		items: itemResults,
		babies: babyResults
	};

	res.json({
		data: req.body
	});
});

app.use("/api", router);

let start = express.Router();
start.post("/", (req, res) => {
	started = true;
	res.json({
		message: "gameOver"
	});
});
start.get("/", (req, res) => {
	res.json({
		gameOver: started
	});
});
app.use("/gameOver", start);

app.server.listen(7000, () => {
	console.log(`Started on port ${app.server.address().port}`);
});

export default app;
