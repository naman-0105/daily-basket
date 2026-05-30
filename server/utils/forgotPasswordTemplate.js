const forgotPasswordTemplate = ({ name, otp }) => {
  return `

  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
<div style="background-color: #ffffff; border-radius: 12px; padding: 30px; border: 1px solid #e5e7eb;">
  <h2 style="color: #16a34a; margin-bottom: 20px;">
    Password Reset Request
  </h2>

  <p style="font-size: 16px; color: #374151;">
    Hi <strong>${name}</strong>,
  </p>

  <p style="font-size: 15px; color: #4b5563; line-height: 1.6;">
    We received a request to reset your DailyBasket account password.
    Use the OTP below to proceed:
  </p>

  <div style="
    background-color: #f3f4f6;
    border: 2px dashed #16a34a;
    border-radius: 10px;
    padding: 20px;
    text-align: center;
    margin: 25px 0;
  ">
    <span style="
      font-size: 32px;
      font-weight: bold;
      letter-spacing: 8px;
      color: #16a34a;
    ">
      ${otp}
    </span>
  </div>

  <p style="font-size: 14px; color: #6b7280;">
    This OTP is valid for <strong>1 hour</strong>.
  </p>

  <p style="font-size: 14px; color: #ef4444;">
    If you did not request a password reset, you can safely ignore this email.
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

export default forgotPasswordTemplate;
