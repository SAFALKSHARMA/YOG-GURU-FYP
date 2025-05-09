import transporter from "../config/nodemailer.js";

// Send enrollment email with inline CSS styling for email clients
export const sendEnrollmentEmail = async (user, instructor, classData) => {
  const userMailOptions = {
    from: process.env.SENDER_EMAIL,
    to: user.email,
    subject: `🧘‍♀️ Enrollment Confirmation: ${classData.className}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Yoga Class Enrollment</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: Arial, sans-serif; color: #333333; line-height: 1.6;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f5f5f5">
          <tr>
            <td align="center" style="padding: 20px 0;">
              <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <!-- Header -->
                <tr>
                  <td align="center" bgcolor="#e8f5e9" style="padding: 30px 20px; border-bottom: 1px solid #c8e6c9;">
                    <div style="font-size: 36px; margin-bottom: 10px;">☸️</div>
                    <h1 style="margin: 0; font-size: 24px; font-weight: 300; color: #2e7d32;">Your Yoga Journey Continues</h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 30px 30px 20px 30px;">
                    <p style="font-style: italic; text-align: center; color: #558b2f; margin-bottom: 20px;">"The journey of a thousand miles begins with a single step."</p>
                    
                    <p style="margin-bottom: 15px;">Dear <span style="font-weight: 600; color: #333333;">${
                      user.name
                    }</span>,</p>
                    
                    <p style="margin-bottom: 20px;">
                      We are delighted to confirm your enrollment in <span style="font-weight: 600; color: #2e7d32;">${
                        classData.className
                      }</span>.
                      Your commitment to wellness and personal growth is truly inspiring.
                    </p>
                    
                    <!-- Class details card -->
                    <div style="margin: 25px 0; background-color: #f1f8e9; border-left: 4px solid #7cb342; padding: 20px; border-radius: 4px;">
                      <h2 style="margin-top: 0; margin-bottom: 15px; color: #33691e; font-size: 18px;">Class Details</h2>
                      
                      <table width="100%" border="0" cellspacing="0" cellpadding="0">
                        <tr>
                          <td width="100" style="padding: 8px 0; font-weight: 600; color: #555555;">Date:</td>
                          <td style="padding: 8px 0;">${new Date(
                            classData.date
                          ).toLocaleDateString()}</td>
                        </tr>
                        <tr>
                          <td width="100" style="padding: 8px 0; font-weight: 600; color: #555555;">Time:</td>
                          <td style="padding: 8px 0;">${classData.time}</td>
                        </tr>
                        <tr>
                          <td width="100" style="padding: 8px 0; font-weight: 600; color: #555555;">Duration:</td>
                          <td style="padding: 8px 0;">${
                            classData.duration
                          } minutes</td>
                        </tr>
                        <tr>
                          <td width="100" style="padding: 8px 0; font-weight: 600; color: #555555;">Instructor:</td>
                          <td style="padding: 8px 0;">${
                            instructor.fullName
                          }</td>
                        </tr>
                        <tr>
                          <td colspan="2" style="padding: 15px 0 0 0; border-top: 1px solid #c5e1a5; margin-top: 10px;">
                            <div style="font-weight: 600; color: #555555; margin-bottom: 5px;">Class Link:</div>
                            <a href="${
                              classData.classLink
                            }" style="color: #558b2f; text-decoration: underline;">${
      classData.classLink
    }</a>
                          </td>
                        </tr>
                      </table>
                    </div>
                    
                    <div style="margin-bottom: 25px;">
                      <p style="margin-bottom: 10px;">Please arrive 10 minutes early with your mat and water bottle. Wear comfortable clothing that allows for free movement.</p>
                      <p style="margin-bottom: 10px;">We look forward to guiding you through this transformative practice.</p>
                    </div>
                    
                    <div>
                      <p style="margin-bottom: 5px;">With peace and gratitude,</p>
                      <p style="font-weight: 600; color: #2e7d32; margin-top: 0;">The Mindful Yoga Team</p>
                    </div>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td align="center" bgcolor="#e8f5e9" style="padding: 20px; border-top: 1px solid #c8e6c9; font-size: 14px; color: #666666;">
                    <p style="margin-bottom: 10px;">🧘‍♀️ Breathe. Center. Transform. 🧘‍♂️</p>
                    <p style="margin: 0;">&copy; ${new Date().getFullYear()} Mindful Yoga. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  };

  const instructorMailOptions = {
    from: process.env.SENDER_EMAIL,
    to: instructor.email,
    subject: `🧘‍♀️ New Student Enrolled: ${classData.className}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Student Enrollment</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: Arial, sans-serif; color: #333333; line-height: 1.6;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f5f5f5">
          <tr>
            <td align="center" style="padding: 20px 0;">
              <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <!-- Header -->
                <tr>
                  <td align="center" bgcolor="#f3e5f5" style="padding: 30px 20px; border-bottom: 1px solid #e1bee7;">
                    <div style="font-size: 36px; margin-bottom: 10px;">☸️</div>
                    <h1 style="margin: 0; font-size: 24px; font-weight: 300; color: #6a1b9a;">New Student Notification</h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 30px 30px 20px 30px;">
                    <p style="font-style: italic; text-align: center; color: #8e24aa; margin-bottom: 20px;">"In the practice of teaching, we find our own deepest learning."</p>
                    
                    <p style="margin-bottom: 15px;">Dear <span style="font-weight: 600; color: #333333;">${
                      instructor.fullName
                    }</span>,</p>
                    
                    <p style="margin-bottom: 20px;">
                      We're pleased to inform you that <span style="font-weight: 600; color: #6a1b9a;">${
                        user.name
                      }</span> has enrolled in your 
                      <span style="font-weight: 600; color: #6a1b9a;">${
                        classData.className
                      }</span> class.
                    </p>
                    
                    <!-- Class details card -->
                    <div style="margin: 25px 0; background-color: #f3e5f5; border-left: 4px solid #ab47bc; padding: 20px; border-radius: 4px;">
                      <h2 style="margin-top: 0; margin-bottom: 15px; color: #6a1b9a; font-size: 18px;">Class Details</h2>
                      
                      <table width="100%" border="0" cellspacing="0" cellpadding="0">
                        <tr>
                          <td width="120" style="padding: 8px 0; font-weight: 600; color: #555555;">Date:</td>
                          <td style="padding: 8px 0;">${new Date(
                            classData.date
                          ).toLocaleDateString()}</td>
                        </tr>
                        <tr>
                          <td width="120" style="padding: 8px 0; font-weight: 600; color: #555555;">Time:</td>
                          <td style="padding: 8px 0;">${classData.time}</td>
                        </tr>
                        <tr>
                          <td width="120" style="padding: 8px 0; font-weight: 600; color: #555555;">Duration:</td>
                          <td style="padding: 8px 0;">${
                            classData.duration
                          } minutes</td>
                        </tr>
                        <tr>
                          <td width="120" style="padding: 8px 0; font-weight: 600; color: #555555;">Total Students:</td>
                          <td style="padding: 8px 0;">${
                            classData.students.length
                          }</td>
                        </tr>
                      </table>
                    </div>
                    
                    <div style="margin-bottom: 25px;">
                      <p>You can access the complete student roster and prepare for your session through your instructor dashboard.</p>
                    </div>
                    
                    <div>
                      <p style="margin-bottom: 5px;">With appreciation for your guidance,</p>
                      <p style="font-weight: 600; color: #6a1b9a; margin-top: 0;">The Mindful Yoga Team</p>
                    </div>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td align="center" bgcolor="#f3e5f5" style="padding: 20px; border-top: 1px solid #e1bee7; font-size: 14px; color: #666666;">
                    <p style="margin-bottom: 10px;">🧘‍♀️ Guiding with wisdom and compassion 🧘‍♂️</p>
                    <p style="margin: 0;">&copy; ${new Date().getFullYear()} Mindful Yoga. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(userMailOptions);
    await transporter.sendMail(instructorMailOptions);
    console.log("Enrollment emails sent successfully");
  } catch (error) {
    console.error("Error sending enrollment emails:", error);
  }
};

export const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: `YOG-GURU <${process.env.SENDER_EMAIL}>`,
    to,
    subject,
    html,
  };

  return transporter.sendMail(mailOptions);
};

// emailTemplates.js
export const bookingStatusTemplate = (data) => {
  const { status, userName, bookingDetails, instructor } = data;

  const isApproved = status === "Approved";
  const color = isApproved ? "#4CAF50" : "#F44336";
  const header = isApproved ? "Session Approved!" : "Session Not Available";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: ${color}; color: white; padding: 15px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { padding: 20px; background: #f9f9f9; border-radius: 0 0 5px 5px; }
        .details { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #777; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>${header}</h2>
        </div>
        <div class="content">
          <p>Dear ${userName},</p>
          
          ${
            isApproved
              ? `<p>Your yoga session has been confirmed! Here are the details:</p>`
              : `<p>We're sorry, but your session request couldn't be accommodated.</p>`
          }
          
          <div class="details">
            <h3>Session Details</h3>
            <p><strong>Type:</strong> ${bookingDetails.yogaType}</p>
            <p><strong>Date:</strong> ${bookingDetails.preferredDate}</p>
            <p><strong>Time:</strong> ${bookingDetails.preferredTime}</p>
            ${
              !isApproved && bookingDetails.rejectionReason
                ? `<p><strong>Reason:</strong> ${bookingDetails.rejectionReason}</p>`
                : ""
            }
          </div>
          
          <p><strong>Instructor:</strong> ${instructor.name}</p>
          
          ${
            isApproved
              ? `<p>Please arrive 10 minutes early. Contact us if you need to reschedule.</p>`
              : `<p>We encourage you to try booking another session at a different time.</p>`
          }
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} Yoga Studio</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};
