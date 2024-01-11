import { API_URL } from "../../settings.js";
import { handleHttpErrors, makeOptions, sanitizer } from "../../utility.js";

const URL = API_URL + "/attendees";

export function initSignup() {
  document.querySelector("#btn-signup").addEventListener("click", signup);
}

async function signup() {
  event.preventDefault();

  const username = sanitizer(document.querySelector("#input-username").value);
  const email = sanitizer(document.querySelector("#input-email").value);
  const phoneNumber = sanitizer(document.querySelector("#input-phone").value);
  const password = sanitizer(document.querySelector("#input-password").value);
  const passwordCheck = sanitizer(
    document.querySelector("#input-password2").value
  );

  const signupRequest = {
    username: username,
    email: email,
    phoneNumber: phoneNumber,
    password: password,
  };

  try {
    const res = await fetch(URL, makeOptions("POST", signupRequest)).then((r) =>
      handleHttpErrors(r)
    );
    window.router.navigate("/login");
  } catch (err) {
    if (err.message === "Username already exists") {
      document.querySelector("#invalid-feedback-username").innerHTML =
        "Brugernavn er allerede i brug.";
    }
    if (err.message === "Email already exists") {
      document.querySelector("#invalid-feedback-email").innerHTML =
        "Email er allerede i brug.";
    }
  }
}