/* eslint-disable no-unused-vars */
export const sendEmail = async (from, to, subject, text, token) => {
  try {
    const response = await fetch("http://localhost:8000/api/logbooks/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ from, to, subject, text }),
    });
  } catch (error) {
    console.error("Error:", error);
  }
};
