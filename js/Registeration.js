const form = document.getElementById("regForm");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const phone = document.getElementById("mobile").value.trim();
  const userType = document.querySelector('input[name="usertype"]:checked').value;

  fetch("http://localhost:3000/Users")
    .then(res => res.json())
    .then(users => {
        console.log(users);
      // Check if email already exists
      const existingUser = users.find(user => user.Email === email);
      if (existingUser) {
        alert("⚠️ Email already registered.");
        return;
      }

      // Generate new UserID
      const newId = users.length ? Math.max(...users.map(u => u.UserID)) + 1 : 1;

      // New user object
      const newUser = {
        UserID: newId,
        Username: username,
        Email: email,
        Password: password,
        Phone: phone,
        UserType: userType === "Administrator" ? "Admin" : "User"
      };

      // Submit user
      fetch("http://localhost:3000/Users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser)
      })
        .then(() => {
          alert("🎉 Registration successful!");
          form.reset();
          document.querySelectorAll(".form-control").forEach(el => el.classList.remove("is-valid"));
        })
        .catch(err => console.error("Registration error:", err));
    });
});
