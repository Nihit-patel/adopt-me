const express = require("express");
const session = require("express-session");
const fs = require("fs");

const app = express();
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "a-secret-key-to-encrypt-session-data", // change in production
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, sameSite: "lax" },
  })
);

// navigation bar
function getNavigation(isLoggedIn) {
  const logoutReq = isLoggedIn ? '<li><a href="/logout">Logout</a></li>' : "";

  return `<nav class="sidebar">
    <ul>
        <li><a href="/home">Home</a></li>
        <li><a href="/cat-care">Cat Care</a></li>
        <li><a href="/dog-care">Dog Care</a></li>
        <li><a href="/find-pet">Find a dog/cat</a></li>
        <li><a href="/pet-giveaway">Have a pet to give away</a></li>
        <li><a href="/contact-us">Contact Us</a></li>
        <li><a href="/create-account">Create Account</a></li>
        <li><a href="/refrences">Refrences</a></li>
        ${logoutReq}
    </ul>
</nav>`;
}

function geHTMLPage(contentFile, isLoggedIn) {
  const navigation = getNavigation(isLoggedIn);
  const content = fs.readFileSync(__dirname + "/" + contentFile, "utf8");

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nihit's Adoption Center</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    ${header}
    <div class="main">
        ${navigation}
        ${content}
    </div>
    ${footer}
    <script src="script.js"></script>
</body>
</html>`;
}

// Routes

// redirect to home page
app.get("/", (req, res) => {
  res.redirect("/home");
});

// home page
app.get("/home", (req, res) => {
  const isLoggedIn = !!req.session.user;
  const html = geHTMLPage("/views/Project_Home.html", isLoggedIn);
  res.send(html);
});

// find pet page
app.get("/find-pet", (req, res) => {
  const isLoggedIn = !!req.session.user;
  const html = geHTMLPage("/views/Find_Pet.html", isLoggedIn);
  res.send(html);
});

// handle pet search form submissions
app.post("/available-pets", (req, res) => {
  const isLoggedIn = !!req.session.user;
  const { petType, breed, age, gender, characteristics } = req.body;
  const findParameters = { petType, breed, age, gender, characteristics };
  const findCorrespondingPetsArr = findPet(findParameters);

  let petDivs = "";

  if (findCorrespondingPetsArr.length === 0) {
    petDivs = `
      <div class="no-pets-found">
        <h4>No Pets Found</h4>
        <p>Sorry, we couldn't find any pets that match your search criteria.</p>
        <p><a href="/find-pet">Please Try Again</a> with a broadened search.</p>
      </div>`;
  }

  findCorrespondingPetsArr.forEach(function (pet) {
    let dogsDisplay = "none";
    let catsDisplay = "none";
    let childrenDisplay = "none";
    const characteristicsArr = pet[6]?.split(",");
    if (characteristicsArr.includes("dogs")) {
      dogsDisplay = "list-item";
    }
    if (characteristicsArr.includes("cats")) {
      catsDisplay = "list-item";
    }
    if (characteristicsArr.includes("children")) {
      childrenDisplay = "list-item";
    }
    petDivs += `<div class="petsBrowseInfo">
  <h4>Pet #${pet[0]}</h4>
    <img class="petsBrowseImage" src="https://media.istockphoto.com/id/1186734274/vector/vector-image-of-dog-and-cat-logo-on-white.jpg?s=612x612&w=0&k=20&c=p_wU6nJyvY_31FlX4MSo8MMH1hBHcFo5HxutZccwL4c=" 
    alt="Happy dog and cat"></a>
  <h4>Pet Details</h4>
  <ul>
      <li><b>Type: </b>${uppercaseFirst(pet[2])}</li>
      <li><b>Breed: </b>${uppercaseFirst(pet[3])}</li>
      <li><b>Age: </b>${uppercaseFirst(pet[4])}</li>
      <li><b>Gender: </b>${uppercaseFirst(pet[5])}</li>
  </ul>
  <h4>Pet Characteristics</h4>
  <ul>
      <li style="display:${dogsDisplay}">Gets along with other dogs.</li>
      <li style="display:${catsDisplay}">Gets along with other cats.</li>
      <li style="display:${childrenDisplay}">Suitable for family with small children.</li>
      <li><b>Pros: </b>${pet[7]}</li>
  </ul>
  <input type="button" class="petsBrowseButton" value="Interested">
</div>
<br>`;
  });
  const navigation = getNavigation(isLoggedIn);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>br
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Browse Available Pets</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    ${header}
    <div class="main">
        ${navigation}
          <div class="content">
            ${petDivs}
          </div>
        </div>
    </div>
    ${footer}
    <script src="script.js"></script>
</body>
</html>`;
  res.send(html);
});

// Dog care page
app.get("/dog-care", (req, res) => {
  const isLoggedIn = !!req.session.user;
  const html = geHTMLPage("/views/Dog_Care.html", isLoggedIn);
  res.send(html);
});

// Cat care page
app.get("/cat-care", (req, res) => {
  const isLoggedIn = !!req.session.user;
  const html = geHTMLPage("/views/Cat_Care.html", isLoggedIn);
  res.send(html);
});

// account registration
app.post("/register-account", (req, res) => {
  const { username, password } = req.body;
  const valid = newUserRegistration(username, password);
  let msg = "";
  let link = "";
  let redirect = "";
  if (valid) {
    msg += `${username} has been succesfully registered! <br> You are now ready to log in if you'd like to.`;
    link += "/home";
    redirect += "Home";
  } else {
    msg += `${username} is already taken. Please try another username.`;
    link += "/create-account";
    redirect += "Try another username";
  }
  let html = `<div style="text-align: center; margin-top:20px;">
  <p>${msg}</p>
  <a href="${link}">${redirect}</a>
  </div>`;
  res.send(html);
});

// create account
app.get("/create-account", (req, res) => {
  const isLoggedIn = !!req.session.user;
  const html = geHTMLPage("/views/Create_Account.html", isLoggedIn);
  res.send(html);
});

// give pet away, requires user to login
app.get("/pet-giveaway", (req, res) => {
  const isLoggedIn = !!req.session.user;
  const html = geHTMLPage("/views/Login.html", isLoggedIn);
  res.send(html);
});

// handle login
app.post("/login", (req, res) => {
  const { usernameLogin, passwordLogin } = req.body;
  const validLogin = tryLogin(usernameLogin, passwordLogin);
  if (validLogin) {
    req.session.user = usernameLogin;

    const isLoggedIn = !!req.session.user;
    const html = geHTMLPage("/views/Pet_Giveaway.html", isLoggedIn);
    res.send(html);
  } else {
    res.send(`
      <script>
        alert("Login Failed. Please Try Again!");
        window.location.href = "/pet-giveaway";
      </script>
    `);
  }
});

// handle giving a pet away
app.post("/pet-giveaway-form", (req, res) => {
  if (!req.session.user) {
    return res.send(`
      <script>
        alert("Log in to give away pets");
        window.location.href = "/pet-giveaway";
      </script>
    `);
  } else {
    const username = req.session.user;
    const petsArr = fs
      .readFileSync(__dirname + "/storage/pets.txt")
      .toString()
      .split("\n");
    let count = 0;
    petsArr.forEach(function (val) {
      if (val.trim().length !== 0) {
        count++;
      }
    });
    count++;
    const {
      petType,
      breed,
      age,
      gender,
      characteristics,
      pros,
      firstName,
      familyName,
      email,
    } = req.body;
    const petToAdd = `${count}:${username}:${petType}:${breed}:${age}:${gender}:${
      characteristics?.join(",") || ""
    }:${pros}\n`;
    fs.appendFileSync(__dirname + "/storage/pets.txt", petToAdd);
    res.send(`
    <script>
      alert("Thank you for giving your pet to a loving family!");
      window.location.href = "/home";
    </script>
    `);
  }
});

// Logout, only appears if user is logged in
app.get("/logout", (req, res) => {
  req.session.destroy();
  let html = `<div style="text-align: center; margin-top:20px;">
  <p>Succesfully logged out.</p>
  <a href="/home">Home</a>
  </div>`;
  res.send(html);
});

// contact page
app.get("/contact-us", (req, res) => {
  const isLoggedIn = !!req.session.user;
  const html = geHTMLPage("/views/Contact_Us.html", isLoggedIn);
  res.send(html);
});

// refrence page
app.get("/refrences", (req, res) => {
  const isLoggedIn = !!req.session.user;
  const html = geHTMLPage("/views/Refrences.html", isLoggedIn);
  res.send(html);
});

// privacy and disclaimer page
app.get("/privacy-disclaimer", (req, res) => {
  const isLoggedIn = !!req.session.user;
  const html = geHTMLPage("/views/Privacy_Disclaimer.html", isLoggedIn);
  res.send(html);
});

const header = `<header class="header" id="headerBanner">
        <div class="headerBox">
            <h1>Nihit's Adoption Center</h1>
            <a href="/home"><img id="headerImage" src="dogscats.png" alt="Happy dog and cat"></a>
        </div>
        <div class = "time">
            <span id="weekday">Monday</span>
            <span>,&nbsp</span>
            <span id="month">January</span>
            <span id="day">1</span>
            <span>,&nbsp</span>
            <span id="year">2025</span>
            <br>
            <span id="hour">00</span>
            <span>:</span>
            <span id="minute">00</span>
            <span>:</span>
            <span id="second">00</span>
        </div>
    </header>`;

const footer = `<footer class="footer">
    <p><a href="/privacy-disclaimer">Privacy/Disclaimer Statement</a></p>
    </footer>`;

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Login handling:
// use txt files for simple data storage
function newUserRegistration(user, pass) {
  const usersArr = fs
    .readFileSync(__dirname + "/storage/login.txt")
    .toString()
    .split("\n");
  if (
    usersArr.some(function (value) {
      return value.split(":")[0] === user;
    })
  ) {
    return false;
  } else {
    fs.appendFileSync(__dirname + "/storage/login.txt", `${user}:${pass}\n`); // Save new user
    return true;
  }
}

// check login credentials
function tryLogin(user, pass) {
  const usersArr = fs
    .readFileSync(__dirname + "/storage/login.txt")
    .toString()
    .split("\n");

  return usersArr.some(function (line) {
    const [aUser, thePassword] = line.trim().split(":");
    return aUser === user && thePassword === pass;
  });
}

// find pets based on filters
function findPet({ petType, breed, age, gender, characteristics }) {
  const petsArr = fs
    .readFileSync(__dirname + "/storage/pets.txt")
    .toString()
    .split("\n");

  let petMatchArr = [];
  petsArr.forEach(function (line) {
    const petsParams = line.split(":");
    if (!(petsParams[2] === petType.toLowerCase())) {
      return false;
    }
    if (
      !(petsParams[3] === breed.toLowerCase() || breed.toLowerCase() === "any")
    ) {
      return false;
    }
    if (!(petsParams[4] === age.toLowerCase() || age.toLowerCase() === "any")) {
      return false;
    }
    if (
      !(
        petsParams[5] === gender.toLowerCase() || gender.toLowerCase() === "any"
      )
    ) {
      return false;
    }
    if (characteristics && characteristics.length) {
      const petCharacteristics = petsParams[6]?.split(",") || [];
      for (let i = 0; i < characteristics.length; i++) {
        if (!petCharacteristics.includes(characteristics[i].toLowerCase())) {
          return false;
        }
      }
    }
    petMatchArr.push(petsParams);
  });
  return petMatchArr;
}

// Capitalize first letter of each word
function uppercaseFirst(str) {
  const wordsArr = str.split(" ");
  let newString = "";
  wordsArr.forEach(function (word) {
    newString +=
      " " + word.charAt(0).toUpperCase() + word.substring(1, word.length);
  });
  return newString;
}
