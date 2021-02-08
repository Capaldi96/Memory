const { MongoClient, ObjectID } = require('mongodb');
const url = 'mongodb+srv://admin:admin123@cluster0.6q8r8.mongodb.net/<dbname>?retryWrites=true&w=majority';
const dbName = 'Memory';
const dbCollection = 'Cards';


function get(filter, callback, collection) {
	MongoClient.connect(url, {
		useUnifiedTopology: true, useNewUrlParser: true,
	}, async (error, client) => {
		if (error) {
			callback('Error, could not connect to database', error.message)
			console.log(error)
			return;
		}
		const theCollection = client.db(dbName).collection(collection);
		try {
			const cursor = theCollection.find(filter);
			const array = await cursor.toArray();
			callback(array);
		} catch (error) {
			console.log('Wrong query, error: ', error.message);
			callback('Failed to get cards.');
		} finally {
			client.close();
		}
	})
}
function getGroup(filter, callback,collection) {
	MongoClient.connect(url, { useUnifiedTopology: true }, async (error, client) => {
		if (error) {
			callback('Error, could not connect to database', error.message)
			console.log(error)
			return;
		}
		const theCollection = client.db(dbName).collection(collection);
		try {
			const cursor = theCollection.aggregate(filter);
			const array = await cursor.toArray();
			callback(array);

		} catch (error) {
			console.log('Wrong query, error: ', error.message);
			callback('Failed to get cards.');

		} finally {
			client.close();
		}
	})
}
function addCard(reqBody, callback) {
	const document = reqBody;
	MongoClient.connect(url, { useUnifiedTopology: true },
		async (error, client) => {
			if (error) {
				callback('Error, could not connect to database', error.message)
				return;
			}
			const col = client.db(dbName).collection(dbCollection);
			try {
				const result = await col.insertOne(document);
				callback({
					result: result.result,
					ops: result.ops
				})
			} catch (error) {
				console.error('Failed to add card: ' + error.message);
				callback('Failed to add card');
			} finally {
				client.close();
			}
		}
	)
}
function addToScoreboard(reqBody, callback) {
	const document = reqBody;
	MongoClient.connect(url, { useUnifiedTopology: true },
		async (error, client) => {
			if (error) {
				callback('Error, could not connect to database', error.message)
				return;
			}
			const col = client.db(dbName).collection('Scoreboard');
			try {
				const result = await col.insertOne(document);
				callback({
					result: result.result,
					ops: result.ops
				})
			} catch (error) {
				console.error('Failed to submit score: ' + error.message);
				callback('Failed to submit score');
			} finally {
				client.close();
			}
		}
	)
}
function getAll(callback, collection) {
	get({}, callback, collection)
}
function getGroupOfCollection(callback, amount, group, collection) {
	let filter;
	if (collection === 'Cards') {
		if (group === 'None') {
			filter = [{ $sample: { size: parseInt(amount) } }];
		} else {
			filter = [{ $match: { group: group } }, { $sample: { size: parseInt(amount) } }];
		}
		
	}else if(collection === 'Scoreboard'){
		filter = [{ $match: { difficulty: group }},{ $sort:{ score: 1, minutes:1, seconds:1} }];
		console.log('scoreboard')
	}
	getGroup(filter, callback, collection)

}
module.exports = {
	getAll,
	addCard,
	getGroupOfCollection,
	addToScoreboard
}
