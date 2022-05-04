import { Handler } from 'express';
import addrs, { ParsedMailbox } from 'email-addresses';

export const parse: Handler = (req, res) => {
	const body = req.body;

	const headers = body.headers;
	const headersParts = headers.split('\n');
	console.log('headersParts => ', headersParts);

	const from: string = body.from;
	const senderParts = addrs.parseOneAddress(from);
	const emailSender = (senderParts as ParsedMailbox).address;
	console.log('emailSender =>', emailSender);

	const to: string = body.to;
	const associationSlug = to.split('@')[0];
	console.log('associationSlug =>', associationSlug);

	const subject: string = body.subject;
	console.log('subject =>', subject);

	const text: string = body.text;
	console.log('description =>', text);

	if (body.cc) {
		const ccs: string[] = body.cc.split(',');
		const emailsCCs = ccs.map(cc => {
			const ccParts = addrs.parseOneAddress(cc);
			return (ccParts as ParsedMailbox).address;
		});
		console.log('emailsCCs =>', emailsCCs);
	}

	if (body.attachments) {
		const attachments = parseInt(body.attachments, 10);
		console.log('attachments =>', attachments);
	}

	if (req.files && req.files.length > 0) {
		console.log(req.files);
	} else {
		console.log('No files');
	}

	return res.json('Email parsed');
};
