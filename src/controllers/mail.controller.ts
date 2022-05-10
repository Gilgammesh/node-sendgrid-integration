import { Handler } from 'express';
import addrs, { ParsedMailbox } from 'email-addresses';
import sgMail from '@sendgrid/mail';
import { apiKeySendgrid, appDomain } from '../configs';

export const parse: Handler = (req, res) => {
  const body = req.body;

  const headers = body.headers;
  console.log(headers);

  const headersParts: string[] = headers.split('\n');
  let messageID: string = '';
  let inReplyTo: string = '';
  let references: string = '';
  let isReplyTo: boolean = false;
  let taskID: string = '';
  headersParts.forEach(part => {
    if (part.includes('Message-ID:')) {
      messageID = part.split(':')[1].replace(/ /g, '');
    }
    if (part.includes('In-Reply-To:')) {
      inReplyTo = part.split(':')[1].replace(/ /g, '');
      if (inReplyTo.includes(`@${appDomain}`)) {
        isReplyTo = true;
        taskID = inReplyTo.split('@')[0].replace('<', '');
      }
    }
    if (part.includes('References:')) {
      references = part.split(':')[1].replace(/ /g, '');
      if (!isReplyTo && references.includes(`@${appDomain}`)) {
        const refParts = references.split(/ /g);
        const search = refParts.find(part => part.includes(`@${appDomain}`));
        taskID = (search as string).split('@')[0].replace('<', '');
      }
    }
  });
  console.log('Message-ID => ', messageID);
  console.log('In-Reply-To => ', inReplyTo);
  console.log('References => ', references);

  const from: string = body.from;
  const senderParts = addrs.parseOneAddress(from);
  const emailSender: string = (senderParts as ParsedMailbox).address;
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

  let subscribers: string[] = isReplyTo ? [] : [emailSender];
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

  if (isReplyTo) {
    // Update an existing task
    console.log(`Update the task: ${taskID}`);

    // New subscribers added
    console.log(`New subscribers: ${subscribers}`);

    const descriptionParts: string[] = text.split('\n');
    const index = descriptionParts.findIndex(part =>
      part.includes('@super.vivatranslate.io')
    );
    const comment = descriptionParts.slice(0, index).join('\r\n');
    console.log('Comment: ', comment);
  } else {
    // Create New Task =>
    taskID = '4agTzegJzb5Zx7jRVtIn';

    subscribers.forEach(async sub => {
      const templateText: string = `
			Created by *${emailSender}*\n
			\n
			*${subject}:* ${text}
			\n
			Notes: You may reply to this email to register your comments or responses. You can also quote some other mail to subscribe.\n`;

      const templateHtml: string = `
			<div dir="ltr">
				<div class="gmail_quote">
					<div dir="ltr">
						<div>Created by <b>${emailSender}</b></div>
						<div><br></div>
						<div><b>${subject}:</b>  ${text}  <br></div>
						<div><br></div>
						<div>Notes: You may reply to this email to register your comments or responses. You can also quote some other mail to subscribe.</div>
					</div>
				</div>
			</div>
			`;
      if (
        await sendEmail(
          sub,
          to,
          'A new task has been created',
          templateText,
          templateHtml,
          taskID,
          messageID
        )
      ) {
        console.log(`Mail to: ${sub} => successfully sent`);
      } else {
        console.log(`Mail to: ${sub} => shipping failure`);
      }
    });
  }

  return res.json('Email parsed');
};

const sendEmail = async (
  to: string,
  from: string,
  subject: string,
  text: string,
  html: string,
  taskID: string,
  msgID: string
) => {
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
      'Message-ID': `<${taskID}@${appDomain}>`, // Task ID and domain email
      References: msgID // Reference the original Message ID
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
