/*
This file contains the time display logic and the logic to validate the form inputs.
*/

// For the live time label
const weekday = document.getElementById("weekday");
const day = document.getElementById("day");
const month = document.getElementById("month");
const year = document.getElementById("year");
const hour = document.getElementById("hour");
const minute = document.getElementById("minute");
const second = document.getElementById("second");

setInterval(() => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const date = new Date();

  weekday.innerHTML = days[date.getDay()];
  day.innerHTML = date.getDate();
  month.innerHTML = months[date.getMonth()];
  year.innerHTML = date.getFullYear();
  hour.innerHTML = (date.getHours() < 10 ? "0" : "") + date.getHours();
  minute.innerHTML = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
  second.innerHTML = (date.getSeconds() < 10 ? "0" : "") + date.getSeconds();
});

function validateFormFind_Pet() {
  // validation for Find_Pet form.
  const breed = document.getElementById("breed");

  if (breed.value.trim() === "") {
    alert("Please enter the desired breed. Enter 'Any' if no prefrences.");
    return false;
  }

  return true;
}

function validateFormPet_Giveaway() {
  // validation for Pet_Giveaway
  const breed = document.getElementById("breed");
  const pros = document.getElementById("pros");
  const firstName = document.getElementById("firstName");
  const lastName = document.getElementById("familyName");
  const email = document.getElementById("email");

  if (breed.value.trim() === "") {
    alert("Please enter the breed of your pet.");
    return false;
  } else if (pros.value.trim() === "") {
    alert("Please enter the pros of owning this pet.");
    return false;
  } else if (firstName.value.trim() === "") {
    alert("Please enter your first name.");
    return false;
  } else if (lastName.value.trim() === "") {
    alert("Please enter your family name.");
    return false;
  } else if (email.value.trim() === "" || !validateEmail(email.value)) {
    alert("Please enter a valid email.");
    return false;
  } else {
    return true; // if everything is good
  }
}

function validateEmail(email) {
  // check if email is valid. If valid returns true, if not then returns false
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

function validateRegistration() {
  const username = document.getElementById("username");
  const password = document.getElementById("password");

  const usernameTest = username.value.trim();
  const passwordTest = password.value.trim();

  const patternAlphaNumerical = /^[A-Za-z0-9]*$/;
  const patternDigit = /\d/;
  const patternAlpha = /[A-Z]/i;

  let usernameValid = false;
  let passwordValid = false;

  if (patternAlphaNumerical.test(usernameTest)) {
    usernameValid = true;
  } else {
    alert("Please enter a valid username!");
  }

  if (
    // password needs to be at least 4 characters, with at least 1 letter and 1 number. No other characters allowed.
    passwordTest.length >= 4 &&
    patternAlphaNumerical.test(passwordTest) &&
    patternDigit.test(passwordTest) &&
    patternAlpha.test(passwordTest)
  ) {
    passwordValid = true;
  } else {
    alert("Please enter a valid password!");
  }

  return usernameValid && passwordValid;
}
