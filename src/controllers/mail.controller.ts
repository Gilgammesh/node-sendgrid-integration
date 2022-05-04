import { Handler } from 'express';
import addrs, { ParsedMailbox } from 'email-addresses';
import sgMail from '@sendgrid/mail';
import { apiKeySendgrid } from '../configs';

export const parse: Handler = (req, res) => {
	const body = req.body;

	const headers = body.headers;
	const headersParts: string[] = headers.split('\n');
	let messageId: string = '';
	headersParts.forEach(part => {
		if (part.includes('Message-ID:')) {
			messageId = part.split(':')[1].replace(/ /g, '');
		}
	});
	console.log('Message-ID => ', messageId);

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

	const html: string = body.html;
	console.log('html =>', html);

	let subscribers = [emailSender];
	if (body.cc) {
		const ccs: string[] = body.cc.split(',');
		const emailsCCs = ccs.map(cc => {
			const ccParts = addrs.parseOneAddress(cc);
			return (ccParts as ParsedMailbox).address;
		});
		subscribers = [...subscribers, ...emailsCCs];
	}
	console.log('subscribers =>', subscribers);

	if (body.attachments) {
		const attachments = parseInt(body.attachments, 10);
		console.log('attachments =>', attachments);
	}

	if (req.files && req.files.length > 0) {
		console.log(req.files);
	} else {
		console.log('No files');
	}

	// Finish parsed email
	console.log('email parsed');

	/*  subscribers.forEach((sub) => { 
        const template = ``
     }) */

	return res.json('Email parsed');
};

const sendEmail = async (to: string, from: string, subject: string, text: string, html: string, msgId: string) => {
	// Pass sendgrid apikey
	sgMail.setApiKey(apiKeySendgrid);

	// Build content email
	const email = {
		to,
		from,
		subject,
		text,
		html,
		headers: {
			'In-Reply-To': msgId, // Reference the original Message ID
			References: msgId // Reference the original Message ID
		}
	};

	// Send email
	try {
		await sgMail.send(email);
		return true;
	} catch (error) {
		console.error('mail.send error:', error);
		return false;
	}
};
