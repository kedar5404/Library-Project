
document.getElementById("registerForm").addEventListener("submit", function (e) {
    e.preventDefault();
    verify();
  });
  
  function verify() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    fetch("http://localhost:3000/Users")
      .then(res => res.json())
      .then(users => {
        // console.log(users);
        const user = users.find(u => u.Email === email && u.Password === password);
        if (user) {
          sessionStorage.setItem("userId", user.UserID);
          sessionStorage.setItem("userName", user.Username);
          sessionStorage.setItem("userType", user.UserType);
          if (user.userType === "Admin") {
            window.location.href = "../admin.html";
          } else {
            window.location.href = "../user.html";
          }
        } else {
          document.getElementById("error").textContent = "Invalid email or password.";
        }
      })
      .catch(err => {
        console.error("Error fetching users:", err);
      });
  }
  
  function getUserId() {
    return sessionStorage.getItem("userId");
  }
  
  function getUserName() {
    return sessionStorage.getItem("userName");
  }
  
  function getUserType() {
    return sessionStorage.getItem("userType");
  }
  
  function logout() {
    sessionStorage.clear();
    sessionStorage.setItem("loggedOut", "true");
    window.location.href = "Registeration.html";
  }
  