const express = require('express');
const bodyParser = require('body-parser');

module.exports = function() {
	const app = express();

	app.use(bodyParser.json());

    require('../app/routes/routes.js')(app);

	return app;
};
