// Netlify event-triggered function — fires on every form submission
// Sends a confirmation email to the customer via Resend

exports.handler = async function (event) {
  const payload = JSON.parse(event.body).payload;

  // Only handle the order-request form
  if (payload.form_name !== "order-request") {
    return { statusCode: 200, body: "Not an order form — skipping." };
  }

  const { name, company, email, phone, notes, items } = payload.data;
  const estimatedTotal = payload.data["estimated-total"] || "N/A";

  // Don't send if no customer email
  if (!email) {
    return { statusCode: 200, body: "No customer email — skipping." };
  }

  // Format the item lines into an HTML table
  const itemLines = (items || "").split("\n").filter(Boolean);
  const itemRows = itemLines
    .map((line) => {
      return `<tr><td style="padding:8px 12px;border-bottom:1px solid #e5e1db;font-family:monospace;font-size:13px;">${line}</td></tr>`;
    })
    .join("");

  const htmlBody = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f5f3ef;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:24px;">

    <!-- Header -->
    <div style="background:#1a2a3a;padding:24px 28px;border-radius:8px 8px 0 0;">
      <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:700;">DJB Technical Sales</h1>
      <p style="margin:4px 0 0;color:rgba(255,255,255,0.6);font-size:12px;letter-spacing:0.05em;">EST. 1988 · TEMPLE CITY, CA</p>
    </div>

    <!-- Body -->
    <div style="background:#ffffff;padding:28px;border:1px solid #e5e1db;border-top:none;">
      <h2 style="margin:0 0 8px;color:#1a2a3a;font-size:18px;">Quote Request Received</h2>
      <p style="margin:0 0 20px;color:#6b6560;font-size:14px;line-height:1.6;">
        Hi ${name},<br><br>
        Thank you for your quote request. We've received the following and will be in touch within one business day to confirm availability, pricing, and shipping.
      </p>

      <!-- Contact Info -->
      <table style="width:100%;margin-bottom:20px;font-size:13px;color:#3a3530;">
        <tr><td style="padding:4px 0;font-weight:600;width:100px;">Name:</td><td>${name}</td></tr>
        <tr><td style="padding:4px 0;font-weight:600;">Company:</td><td>${company}</td></tr>
        <tr><td style="padding:4px 0;font-weight:600;">Email:</td><td>${email}</td></tr>
        ${phone ? `<tr><td style="padding:4px 0;font-weight:600;">Phone:</td><td>${phone}</td></tr>` : ""}
      </table>

      <!-- Items -->
      <div style="background:#faf8f5;border:1px solid #e5e1db;border-radius:6px;overflow:hidden;margin-bottom:16px;">
        <div style="background:#1a2a3a;padding:10px 12px;">
          <span style="color:#ffffff;font-size:12px;font-weight:600;letter-spacing:0.05em;">ITEMS REQUESTED</span>
        </div>
        <table style="width:100%;">
          ${itemRows}
        </table>
        <div style="padding:12px;border-top:2px solid #e5e1db;display:flex;justify-content:space-between;">
          <span style="font-size:13px;font-weight:600;color:#3a3530;">ESTIMATED TOTAL:</span>
          <span style="font-family:monospace;font-size:16px;font-weight:600;color:#1a2a3a;">$${estimatedTotal}</span>
        </div>
      </div>

      ${notes ? `<p style="margin:16px 0 0;padding:12px;background:#faf8f5;border-radius:4px;font-size:13px;color:#6b6560;"><strong>Notes:</strong> ${notes}</p>` : ""}

      <hr style="border:none;border-top:1px solid #e5e1db;margin:24px 0;">

      <p style="margin:0;color:#6b6560;font-size:13px;line-height:1.6;">
        <strong>Questions?</strong> Call us at <a href="tel:6262861348" style="color:#c05020;">(626) 286-1348</a> or reply to this email.<br>
        This is a quote request — no charges have been made.
      </p>
    </div>

    <!-- Footer -->
    <div style="padding:16px 28px;text-align:center;">
      <p style="margin:0;color:#9a958e;font-size:11px;">DJB Technical Sales · Temple City, CA 91780 · (626) 286-1348</p>
    </div>

  </div>
</body>
</html>`;

  // Send via Resend API
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY not set");
    return { statusCode: 500, body: "Email service not configured." };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "DJB Technical Sales <onboarding@resend.dev>",
        to: [email],
        subject: `Quote Request Received — DJB Technical Sales`,
        html: htmlBody,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Resend error:", JSON.stringify(result));
      return { statusCode: response.status, body: JSON.stringify(result) };
    }

    console.log("Confirmation email sent to", email, result);
    return { statusCode: 200, body: "Confirmation email sent." };
  } catch (err) {
    console.error("Email send failed:", err);
    return { statusCode: 500, body: "Failed to send confirmation email." };
  }
};
