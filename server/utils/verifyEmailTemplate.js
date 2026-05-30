const verifyEmailTemplate = ({ name, url }) => {
return `

  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">

<div style="background-color: #ffffff; border-radius: 12px; padding: 30px; border: 1px solid #e5e7eb;">
  
  <div style="font-size: 32px; font-weight: 700; margin-bottom: 20px; font-family: Arial, sans-serif;">
    <span style="color: #EAB308;">daily</span><span style="color: #65A30D;">basket</span>
  </div>

  <p style="font-size: 16px; color: #374151;">
    Hi <strong>${name}</strong>,
  </p>

  <p style="font-size: 15px; color: #4b5563; line-height: 1.6;">
    Thank you for registering with DailyBasket.
    To activate your account and start shopping, please verify your email address by clicking the button below.
  </p>

  <div style="text-align: center; margin: 30px 0;">
    <a
      href="${url}"
      style="
        display: inline-block;
        background-color: #16a34a;
        color: #ffffff;
        text-decoration: none;
        padding: 14px 28px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: bold;
      "
    >
      Verify Email
    </a>
  </div>

  <p style="font-size: 14px; color: #6b7280;">
    If the button doesn't work, copy and paste the following link into your browser:
  </p>

  <p style="
    word-break: break-all;
    background-color: #f3f4f6;
    padding: 12px;
    border-radius: 6px;
    font-size: 13px;
    color: #374151;
  ">
    ${url}
  </p>

  <p style="font-size: 14px; color: #ef4444;">
    If you did not create an account with DailyBasket, you can safely ignore this email.
  </p>

  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 25px 0;" />

  <p style="font-size: 14px; color: #6b7280;">
    Thanks,<br />
    <strong>DailyBasket Team</strong>
  </p>

</div>

<p style="text-align:center; font-size:12px; color:#9ca3af; margin-top:15px;">
  © ${new Date().getFullYear()} DailyBasket. All rights reserved.
</p>

  </div>
  `;
};

export default verifyEmailTemplate;
