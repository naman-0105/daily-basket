const paymentSuccessTemplate = ({ name, totalAmount, orderIds, orderLink }) => {
  const orderNumberText = orderIds?.length ? orderIds.join(', ') : 'N/A';
  const trackingLink = orderLink || '#';

  return `
    <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
      <div style="background-color: #ffffff; border-radius: 12px; padding: 28px; border: 1px solid #e5e7eb;">
        <h2 style="color: #16a34a; margin-bottom: 16px;">Payment Successful</h2>

        <p style="font-size: 16px; color: #374151; margin: 0 0 12px;">
          Hi <strong>${name}</strong>,
        </p>

        <p style="font-size: 15px; color: #4b5563; line-height: 1.6; margin: 0 0 16px;">
          Your payment was successful. Your order is confirmed and will be processed.
        </p>

        <div style="background-color: #f3f4f6; border-radius: 10px; padding: 16px; margin: 18px 0;">
          <p style="margin: 0 0 8px; color: #6b7280; font-size: 13px; text-transform: uppercase; letter-spacing: 0.6px;">Payment details</p>
          <p style="margin: 6px 0; font-size: 15px; color: #111827;"><strong>Amount paid:</strong> ₹${Number(totalAmount).toFixed(2)}</p>
          <p style="margin: 6px 0; font-size: 15px; color: #111827;"><strong>Order IDs:</strong> ${orderNumberText}</p>
        </div>

        <p style="font-size: 14px; color: #6b7280; line-height: 1.6; margin: 0;">
          You will receive updates as your order moves through fulfillment.
        </p>

        <div style="margin: 20px 0;">
          <a href="${trackingLink}" style="display: inline-block; background-color: #16a34a; color: #ffffff; padding: 12px 16px; border-radius: 8px; text-decoration: none; font-weight: bold;">View Order Details</a>
        </div>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />

        <p style="font-size: 14px; color: #6b7280; margin: 0;">
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

export default paymentSuccessTemplate;
