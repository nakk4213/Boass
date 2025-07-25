// ✅ CLEANED & FIXED script.js for Student Portal

// 🔥 Firebase Config - using compat version
const firebaseConfig = {
  apiKey: "AIzaSyC03g2sZxYaCyT1mDGPtqrkN_9RZcZWVic",
  authDomain: "boa-amponsem.firebaseapp.com",
  databaseURL: "https://boa-amponsem-default-rtdb.firebaseio.com",
  projectId: "boa-amponsem",
  storageBucket: "boa-amponsem.firebasestorage.app",
  messagingSenderId: "331161509797",
  appId: "1:331161509797:web:c7e18e6f5773730735d24c"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

// 🌙 Toggle Dark Mode
function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

// 👁️ Toggle Password Visibility
function togglePassword(id, icon) {
  const input = document.getElementById(id);
  if (input.type === "password") {
    input.type = "text";
    icon.classList.replace("fa-eye", "fa-eye-slash");
  } else {
    input.type = "password";
    icon.classList.replace("fa-eye-slash", "fa-eye");
  }
}

// 🔁 Toggle Between Login/Signup
function toggleForm() {
  const signup = document.getElementById("signupForm");
  const login = document.getElementById("loginForm");
  signup.style.display = signup.style.display === "none" ? "block" : "none";
  login.style.display = login.style.display === "none" ? "block" : "none";
  document.querySelector("form").reset();
}

// 🌀 Show/Hide Loader
function showLoader() {
  document.getElementById("loaderOverlay").style.display = "flex";
}
function hideLoader() {
  document.getElementById("loaderOverlay").style.display = "none";
}

// 🎉 Toast Message
function showToast(message) {
  const toast = document.getElementById("loginToast");
  toast.innerText = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

// 🟩 Sign Up
function signUp() {
  const name = document.getElementById("fullName").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const course = document.getElementById("course").value;

  // Clear errors
  ["signupEmailError", "signupPasswordError", "confirmPasswordError", "courseError", "signupSuccess"].forEach(id => {
    document.getElementById(id).innerText = "";
  });

  if (password !== confirmPassword) {
    document.getElementById("confirmPasswordError").innerText = "Passwords do not match.";
    return;
  }
  if (!course) {
    document.getElementById("courseError").innerText = "Please select a course.";
    return;
  }

  showLoader();
  auth.createUserWithEmailAndPassword(email, password)
    .then(cred => {
      return cred.user.updateProfile({ displayName: name }).then(() => {
        return db.ref("students/" + cred.user.uid).set({
          fullName: name,
          email: email,
          course: course
        });
      }).then(() => {
        return cred.user.sendEmailVerification();
      }).then(() => {
        document.getElementById("signupSuccess").innerText = "Signup successful! Please verify your email.";
        showToast("Welcome to Boa Amponsem Senior High!");
        document.querySelector("#signupForm form").reset();
        hideLoader();
      });
    })
    .catch(error => {
      hideLoader();
      document.getElementById("signupEmailError").innerText = error.message;
    });
}

// 🔓 Login
function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  const rememberMe = document.getElementById("rememberMe").checked;

  ["loginEmailError", "loginPasswordError", "loginVerificationError"].forEach(id => {
    document.getElementById(id).innerText = "";
  });

  const persistence = rememberMe
    ? firebase.auth.Auth.Persistence.LOCAL
    : firebase.auth.Auth.Persistence.SESSION;

  showLoader();
  auth.setPersistence(persistence)
    .then(() => auth.signInWithEmailAndPassword(email, password))
    .then(userCredential => {
      const user = userCredential.user;
      if (user.emailVerified) {
        showToast("Welcome back!");
        document.querySelector("#loginForm form").reset();
        setTimeout(() => window.location.href = "dashboard.html", 2000);
      } else {
        auth.signOut();
        document.getElementById("loginVerificationError").innerText = "Please verify your email before logging in.";
      }
      hideLoader();
    })
    .catch(error => {
      hideLoader();
      document.getElementById("loginEmailError").innerText = error.message;
    });
}

// 🔐 Google Login
function googleLogin() {
  showLoader();
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then(result => {
      const user = result.user;
      if (user) {
        showToast("Welcome back!");
        setTimeout(() => window.location.href = "dashboard.html", 2000);
      }
      hideLoader();
    })
    .catch(error => {
      hideLoader();
      alert("Google Sign-In failed: " + error.message);
    });
}

// 🔁 Password Reset
function resetPassword() {
  const email = prompt("Enter your email for reset link:");
  if (email) {
    auth.sendPasswordResetEmail(email)
      .then(() => alert("Password reset email sent."))
      .catch(error => alert("Error: " + error.message));
  }
}

// 👤 Optional Auto-login Redirect
// auth.onAuthStateChanged(user => {
//   if (user && user.emailVerified) {
//     window.location.href = "dashboard.html";
//   }
// });
