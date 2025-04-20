// utils/emailTemplates.js
const formatDate = (date) => new Date(date).toLocaleDateString();

const generateSessionDetails = (booking) => `
  <p><strong>Date:</strong> ${formatDate(booking.preferredDate)}</p>
  <p><strong>Time:</strong> ${booking.preferredTime}</p>
  <p><strong>Duration:</strong> ${booking.sessionDuration} minutes</p>
  <p><strong>Yoga Style:</strong> ${booking.yogaType}</p>
  <p><strong>Location:</strong> ${
    booking.sessionLocation === "instructor"
      ? "Instructor's Studio"
      : "Your Location"
  }</p>
`;

const bookingTemplates = {
  approved: (b, i) => ({
    subject: `🎉 Yoga Session Approved with ${i.name}`,
    html: `
      <h2>Session Approved!</h2>
      <p>Hi ${b.fullName}, your session is confirmed.</p>
      ${generateSessionDetails(b)}
      <p>Contact ${i.name} at ${i.email} for questions.</p>
    `,
    text: `Hi ${b.fullName}, your session with ${
      i.name
    } is approved.\n\nDate: ${formatDate(b.preferredDate)}\nTime: ${
      b.preferredTime
    }\nDuration: ${b.sessionDuration} mins\nYoga Style: ${
      b.yogaType
    }\nLocation: ${
      b.sessionLocation === "instructor"
        ? "Instructor's Studio"
        : "Your Location"
    }\n\nContact ${i.name} at ${i.email}.`,
  }),

  rejected: (b, i) => ({
    subject: `❌ Session Rejected by ${i.name}`,
    html: `
      <h2>Session Unavailable</h2>
      <p>Hi ${b.fullName}, ${i.name} can't accommodate your request.</p>
      ${generateSessionDetails(b)}
      <p>Please try another time or instructor.</p>
    `,
    text: `Hi ${b.fullName}, your request was rejected.\n\nDate: ${formatDate(
      b.preferredDate
    )}\nTime: ${b.preferredTime}\nDuration: ${
      b.sessionDuration
    } mins\nYoga Style: ${b.yogaType}`,
  }),

  reminder: (b, i) => ({
    subject: `⏰ Reminder: Yoga Session with ${i.name}`,
    html: `
      <h2>Upcoming Session Reminder</h2>
      <p>Hi ${b.fullName}, just a reminder about your session.</p>
      ${generateSessionDetails(b)}
      <p>Bring your mat, wear comfy clothes, and arrive early.</p>
    `,
    text: `Hi ${b.fullName}, your session is coming up.\n\nDate: ${formatDate(
      b.preferredDate
    )}\nTime: ${b.preferredTime}\nYoga Style: ${b.yogaType}\nLocation: ${
      b.sessionLocation === "instructor"
        ? "Instructor's Studio"
        : "Your Location"
    }`,
  }),
};

export default bookingTemplates;
