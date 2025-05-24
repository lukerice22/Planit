// resetpass.js
import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { auth } from './firebaseinit.js';

const resetModal = document.getElementById('reset-modal');
const closeBtn = document.getElementById('close-reset');
const resetBtn = document.getElementById('reset-btn');
const resetEmail = document.getElementById('reset-email');
const resetMsg = document.getElementById('reset-msg');
const forgotLink = document.getElementById('forgot-password-link');

// Show the reset password modal
forgotLink.addEventListener('click', (e) => {
  e.preventDefault();
  resetModal.classList.remove('hidden');
});

// Close the modal
closeBtn.addEventListener('click', () => {
  resetModal.classList.add('hidden');
  resetMsg.innerText = '';
  resetEmail.value = '';
});

// Handle reset request
resetBtn.addEventListener('click', async () => {
  const email = resetEmail.value.trim();
  resetMsg.innerText = '';

  if (!email) {
    resetMsg.innerText = "Please enter your email.";
    return;
  }

  try {
  await sendPasswordResetEmail(auth, email);
  console.log("Firebase says reset link sent");

  resetModal.classList.add('hidden');
  resetEmail.value = '';
  resetMsg.innerText = '';
} catch (err) {
  console.error("Reset error:", err);
  resetMsg.innerText = (err.message || "Something went wrong."); 
}
});
