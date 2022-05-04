import { Handler } from 'express';

export const parse: Handler = (req, res) => {
	const body = req.body;

	console.log(body);

	if (req.files && req.files.length > 0) {
		console.log(req.files);
	} else {
		console.log('No files');
	}

	return res.json('Email parsed');
};
