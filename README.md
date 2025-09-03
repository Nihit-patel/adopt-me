# adopt-me
This is a full-stack pet adoption website that allows users to browse and adopt pets as well as put pets up for adoption. This web application is built using HTML, CSS, JavaScript, NodeJS, Express, Cookies and Sessions. It uses text files to store user and pet data. Users can register, login and browse pets by filters. This is a scholarly coursework project to learn full-stack development and basic data persistence.

## Features

**Browse Pets**
- Search pets by type, breed, age, gender and characteristics.

**Pet Details**
- Each pet displays information about its breed, age, gender, and compability with dogs, cats and children, and a short description.

**User Accounts**
- Create an account, and login to put a pet up for adoption. User and pet data is saved in plain text files.

**Dynamic Frontend**
- Clean and simple website created using HTML, CSS, and vanilla JavaScript.
- Form validation and live date and time.

## Tech Stack

**Frontend:** HTML, CSS, JavaScript

**Backend:** Node.js, Express

**Authentication:** Cookies, Sessions

**Storage:** Text files: login.txt (user accounts), pets.txt (pet listings)  

**File Handling:** fs module 

## Future improvements:
- Complete the listings by using contact informations, and assigning real functionality to the "Interested" button.
- Adding likes, reviews, file uploading (pictures and videos) and other engaging features.
- Connect to a proper database using Supabase to handle larger traffic.
- Better UI for mobile and desktop using React.
- Encrypted passwords.

## Setup:

**Install Dependencies**
```npm install express express-session fs```

**Project Structure**
```
blackjack-clicker-game/
│
├── public/        # Static (Pictures and JavaScript for form validation and live time display)
├── storage/       # Text files containing all the persistent data (login.txt + pet.txt)
├── views/         # HTML pages
└── server.js      # the server
```

**Start Server**
```
nodemon server.js
```

**Visit:** http://localhost:3000
