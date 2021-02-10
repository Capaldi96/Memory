const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { cloudinary } = require('./cloudinary')
const path = require('path');
const cors = require('cors');
const { getAll, addCard, getGroupOfCollection, addToScoreboard } = require('./database.js');



const port = process.env.PORT || 5000;

app.use((req, res, next) => {
	console.log(`${req.method} ${req.url}`);
	next();
})
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: '2mb' }));
app.use(cors());

// add middlewares
app.use(express.static(path.join(__dirname, '../dist')))

app.get('/api/getAllCards', (req, res) => {
	getAll(dataOrError => {
		res.send(dataOrError);
	},'Cards');
});
app.get('/api/getCards/:group/:amount', (req, res) => {
	getGroupOfCollection(dataOrError => {
		res.send(dataOrError);
	}, req.params.amount, req.params.group, 'Cards');
});
app.get('/api/getScoreboard/:group', (req, res) => {
	getGroupOfCollection(dataOrError => {
		res.send(dataOrError);
	}, req.params.amount, req.params.group, 'Scoreboard');
});
app.post('/api/addCard', (req, res) => {
	addCard(req.body, dataOrError => {
		res.send(dataOrError);
	})
});
app.post('/api/submitScore', (req, res) => {
	addToScoreboard(req.body, dataOrError => {
		res.send(dataOrError);
	})
});

app.post('/api/uploadImage', async (req, res) => {
	try {
		const fileStr = req.body.data;
		const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
			upload_preset: 'Memory',
			folder: 'Memory/CustomMade/'
		})
		res.json({ status: 'success', id: uploadedResponse.public_id })
	} catch (error) {
		console.log(error)
		res.status(500).json({ err: 'Something went wrong when uploading the image, try again later.' })
	}
})
app.get(/.*/, function (req, res) {
	res.sendFile(path.join(__dirname, '../dist/index.html'))
})
// app.use((req, res, next) => {
// 	res.sendFile(path.join(__dirname, "../dist/index.html"));
// });

app.listen(port, () => {
	console.log("Server is listening on port" + port);
});










