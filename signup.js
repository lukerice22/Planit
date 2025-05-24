import { auth, db } from './firebaseinit.js';

import { 
  createUserWithEmailAndPassword, 
  sendEmailVerification 
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

import {
  doc,
  setDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const usernameInput = document.getElementById('username');
const statusMsg = document.getElementById('username-status');
const submitBtn = document.getElementById('submit-btn');

let checkTimeout;

//unique user check//
usernameInput.addEventListener('input', () => {
  const username = usernameInput.value.trim().toLowerCase();
  statusMsg.innerText = '';
  submitBtn.disabled = true;

  clearTimeout(checkTimeout); // debounce
  if (!username) return;

  checkTimeout = setTimeout(async () => {
    const q = query(collection(db, "users"), where("username", "==", username));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      statusMsg.innerText = "Username is taken";
      statusMsg.style.color = "red";
      submitBtn.disabled = true;
    } else {
      statusMsg.innerText = "Username is available";
      statusMsg.style.color = "green";
      submitBtn.disabled = false;
    }
  }, 400); // wait 400ms after they stop typing
});

const pwInput   = document.getElementById('password');
const pwWrapper = document.getElementById('password-rules-wrapper');
const pwHeader  = document.getElementById('password-header');
const pwList    = document.getElementById('password-requirements');

// 1) Show when they focus
pwInput.addEventListener('focus', () => {
  pwWrapper.classList.add('show');
});

// 2) Live check & hide each bullet when its rule is met
pwInput.addEventListener('input', () => {
  const v = pwInput.value;
  const rules = {
    length:    v.length >= 8,
    symbol:    /[!@#$%^&*(),.?":{}|<>]/.test(v),
    uppercase: /[A-Z]/.test(v),
  };

  // hide satisfied rules
  Object.entries(rules).forEach(([rule, ok]) => {
    pwList
      .querySelector(`[data-rule="${rule}"]`)
      .style.display = ok ? 'none' : 'list-item';
  });

  // if all are met, also hide the header
  const allOk = Object.values(rules).every(Boolean);
  pwHeader.style.display = allOk ? 'none' : 'block';
});

// 3) Always hide the whole thing on blur
pwInput.addEventListener('blur', () => {
  pwWrapper.classList.remove('show');
  // restore header for next focus
  pwHeader.style.display = 'block';
  // also reset list items so they reappear when they re-focus
  pwList.querySelectorAll('li').forEach(li => li.style.display = 'list-item');
});


//_____________________________________________________________________________

const form = document.getElementById('signup-form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email    = form.email.value;
  const password = form.password.value;
  const confirm  = form.confirmpassword.value;

  if (password !== confirm) {
    return alert("Passwords don't match!");
  }

  const username = form.username.value.trim().toLowerCase(); // unique + normalized

  try {
    const q = query(collection(db, "users"), where("username", "==", username));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      alert("That username is already taken. Please choose another.");
      return;
    }

    // Create user
    const { user } = await createUserWithEmailAndPassword(auth, email, password);

    const profile = {
      uid: user.uid,
      email: user.email,
      username,
      createdAt: serverTimestamp()
    };

    // Save to Firestore
    await setDoc(doc(db, 'users', user.uid), profile);

    // Send verification
    await sendEmailVerification(user);
    alert("Verification email sent! Please check your inbox before signing in.");

    form.reset();
    window.location.href = '/signin.html';

  } catch (err) {
    console.error('❌ Signup error:', err.message);
    alert(err.message);
  }
});
