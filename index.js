import "./navigo.js";

import { setActiveLink, loadHtml, renderHtml } from "./utility.js";

import { initHome } from "./pages/home/home.js";
import { initSignup } from "./pages/signup/signup.js";
import { initLogin, toggleLoginStatus, logout } from "./pages/login/login.js";

window.addEventListener("load", async () => {
  const templateHome = await loadHtml("./pages/home/home.html");
  const templateSignup = await loadHtml("./pages/signup/signup.html");
  const templateNotFound = await loadHtml("./pages/notFound/notFound.html");
  const templateLogin = await loadHtml("./pages/login/login.html");

  //If token existed, for example after a refresh, set UI accordingly
  const token = localStorage.getItem("token");
  toggleLoginStatus(token);

  const router = new Navigo("/", { hash: true });
  window.router = router;
  let forceReload = false;  
  router
    .hooks({
      before(done, match) {
        setActiveLink("menu", match.url);
        done();
      },
    })
    .on({
      "/": () => {
        renderHtml(templateHome, "content");
        initHome();
      },
      "/signup": () => {
        renderHtml(templateSignup, "content");
        initSignup();
      },
      "/login": (match) => {
        renderHtml(templateLogin, "content");
        initLogin();
      },
      "/logout": () => {
        ()=> router.navigate("/")
        logout()
      }
    })
    .notFound(() => {
      renderHtml(templateNotFound, "content");
    })
    .resolve();
});

window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
  alert(
    "Error: " +
      errorMsg +
      " Script: " +
      url +
      " Line: " +
      lineNumber +
      " Column: " +
      column +
      " StackTrace: " +
      errorObj
  );
};