import nodemailer from 'nodemailer';

// Create transporter only if credentials are available
const createTransporter = () => {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT);

  if (!user || !pass || !host || !port) {
    console.warn('Email credentials not configured. Emails will not be sent.');
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: true,
    auth: { user, pass },
  });
};

export async function sendOrderConfirmation(order: any, email: string) {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.log('Email service not configured. Skipping email notification.');
      return;
    }

    const orderDetails = order.items.map((item: any) => 
      `${item.name} x ${item.quantity} - ₱${item.price.toFixed(2)}`
    ).join('\n');

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: `Order Confirmation #${order._id}`,
      text: `
Thank you for your order!

Order Details:
${orderDetails}

Total Amount: ₱${order.total.toFixed(2)}
Payment Method: ${order.paymentMethod === 'gcash' ? 'GCash' : 'Cash on Pickup'}

${order.paymentMethod === 'gcash' ? 
  'Please complete your GCash payment to process your order.' :
  'Please prepare the exact amount when picking up your order.'}

Thank you for choosing Kusina de Amadeo!
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent successfully');
  } catch (error) {
    console.error('Error sending order confirmation:', error);
    // Don't throw the error to prevent order creation from failing
  }
}

export async function sendOrderStatusUpdate(order: any, email: string) {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.log('Email service not configured. Skipping email notification.');
      return;
    }

    const statusColors: { [key: string]: string } = {
      pending: '#ECC94B',
      confirmed: '#48BB78',
      preparing: '#4299E1',
      'out-for-delivery': '#9F7AEA',
      delivered: '#38A169',
      cancelled: '#F56565',
    };

    const mailOptions = {
      from: `"Kusina De Amadeo" <${process.env.SMTP_FROM}>`,
      to: email,
      subject: `Order Status Update #${order._id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4a5568; text-align: center;">Order Status Update</h1>
          
          <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #2d3748; margin-bottom: 15px;">Order Details</h2>
            <p><strong>Order ID:</strong> ${order._id}</p>
            <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
            <p>
              <strong>Status:</strong> 
              <span style="
                background-color: ${statusColors[order.status] || '#718096'}; 
                color: white; 
                padding: 4px 8px; 
                border-radius: 4px;
              ">
                ${order.status.toUpperCase()}
              </span>
            </p>
          </div>

          <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="font-size: 16px; line-height: 1.5;">
              Your order status has been updated to <strong>${order.status.toUpperCase()}</strong>.
              ${getStatusMessage(order.status)}
            </p>
          </div>

          <div style="text-align: center; color: #718096; margin-top: 30px;">
            <p>If you have any questions about your order, please contact us at:</p>
            <p>Email: kusinadeamadeo@gmail.com</p>
            <p>Phone: +63 993 971 9689</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending status update:', error);
    return false;
  }
}

export async function sendOrderStatusEmail(order: any) {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.log('Email service not configured. Skipping email notification.');
      return;
    }

    const statusMessages = {
      pending: 'Your order is pending confirmation.',
      confirmed: 'Your order has been confirmed and is being processed.',
      preparing: 'Your order is being prepared.',
      completed: 'Your order has been completed.',
      cancelled: 'Your order has been cancelled.',
    };

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: order.customer.email,
      subject: `Order Status Update #${order._id}`,
      text: `
Hello ${order.customer.name},

Your order status has been updated to: ${order.status.toUpperCase()}

${statusMessages[order.status as keyof typeof statusMessages] || ''}

Order Details:
${order.items.map((item: any) => `${item.name} x ${item.quantity} - ₱${item.price.toFixed(2)}`).join('\n')}

Total Amount: ₱${order.total.toFixed(2)}

If you have any questions, please contact us.

Thank you for choosing Kusina de Amadeo!
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Order status update email sent successfully');
  } catch (error) {
    console.error('Error sending order status update:', error);
  }
}

function getStatusMessage(status: string): string {
  switch (status) {
    case 'confirmed':
      return 'We have received and confirmed your order. We will start preparing it soon.';
    case 'preparing':
      return 'Your order is now being prepared by our kitchen staff.';
    case 'out-for-delivery':
      return 'Your order is on its way! Our delivery rider will contact you shortly.';
    case 'delivered':
      return 'Your order has been successfully delivered. Enjoy your meal!';
    case 'cancelled':
      return 'Your order has been cancelled. If you have any questions, please contact our support.';
    default:
      return 'Thank you for choosing Kusina De Amadeo!';
  }
}
