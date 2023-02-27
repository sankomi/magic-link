const sqlite3 = require("sqlite3");

class Sqlite {
	constructor(name) {
		this.db = new sqlite3.Database(`./${name}.db`);
	}

	run(sql, params = []) {
		return new Promise((resolve, reject) => {
			this.db.get(sql, params, function(error) {
				if (error) reject(error);
				else resolve({id: this.lastID});
			});
		});
	}

	get(sql, params = []) {
		return new Promise((resolve, reject) => {
			this.db.get(sql, params, (error, result) => {
				if (error) reject(error);
				else resolve(result);
			});
		});
	}

	all(sql, params = []) {
		return new Promise((resolve, reject) => {
			this.db.all(sql, params, (error, results) => {
				if (error) reject(error);
				else resolve(results);
			});
		});
	}
}

function open(name) {
	return new Sqlite(name);
}

module.exports = {
	open,
};
