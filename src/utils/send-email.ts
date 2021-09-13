interface SendEmailInput {
  to: string;
  subject: string;
  text: string;
}

export const sendEmail = (input: SendEmailInput) => {
  console.log();
  console.log(`To: ${input.to}`);
  console.log(`Subject: ${input.subject}`);
  console.log();
  console.log(input.text);
  console.log();
};
