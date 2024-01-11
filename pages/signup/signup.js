import { API_URL } from "../../settings.js";
import { handleHttpErrors, makeOptions, sanitizer } from "../../utility.js";

const URL = API_URL + "/guests";

export function initSignup() {
  document.querySelector("#btn-signup").addEventListener("click", signup);
}

async function signup() {
  const username = sanitizer(document.querySelector("#input-username").value);
  const email = sanitizer(document.querySelector("#input-email").value);
  const phoneNumber = sanitizer(document.querySelector("#input-phone").value);
  const firstName = sanitizer(document.querySelector("#input-firstname").value);
  const lastName = sanitizer(document.querySelector("#input-lastname").value);
  const password = sanitizer(document.querySelector("#input-password").value);
  const passwordCheck = sanitizer(document.querySelector("#input-password2").value);

  if (!validPassword(password, passwordCheck)) {
    return;
  }

  const request = {
    username: username,
    email: email,
    phoneNumber: phoneNumber,
    firstName: firstName,
    lastName: lastName,
    password: password,
  };
  try {
    const res = await fetch(URL, makeOptions("POST", request)).then((r) =>
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
// Valider om de to indtastede passwords er ens
function validPassword(password, passwordCheck) {
  if (password !== passwordCheck) {
    document.querySelector("#invalid-feedback-pw2").innerHTML = "Passwords don't match.";
    return false; // Stopper yderligere eksekvering, hvis passwords ikke matcher
  }
  return true;
}

