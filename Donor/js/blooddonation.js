import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-analytics.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
const firebaseConfig = {
  apiKey: "AIzaSyB5piM8HyYATgWqMPi2U6bwAVz94Q189Bs",
  authDomain: "fir-basics-569a0.firebaseapp.com",
  projectId: "fir-basics-569a0",
  storageBucket: "fir-basics-569a0.appspot.com",
  messagingSenderId: "971203436246",
  appId: "1:971203436246:web:11d5aa9c6a02ee8dc6f377",
  measurementId: "G-LGY93EHL4E",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const googleProvider = new GoogleAuthProvider();
import {
  getFirestore,
  doc,
  getDoc,
  getDocs, //get all documents inside one collection
  setDoc,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  deleteField,
  query,
  where,
  orderBy,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
const db = getFirestore();
const auth = getAuth();
// ------------------------------------------------------------------------
const countryInput = document.getElementById("country");
const provinceInput = document.getElementById("province");
const cityInput = document.getElementById("city");
const registerButton = document.getElementById("registerBtn");
const medicalCenterData = [];
const medicalCentersSpinner = document.getElementById("medical-centers");
const infobutton = document.getElementById("info-button");
const scheduleDateInput = document.getElementById("schedule-date"); 
const scheduleTimeInput = document.getElementById("schedule-time"); 

getMedicalCentersName();

async function getMedicalCentersName() {
    const q = query(collection(db, "MedicalCenters"));
    getDocs(q).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            medicalCenterData.push({
                email: doc.id,
                centerName: doc.data().medicalNameMedicalCenter
            });
        });
        fillSpinnerCentersName(medicalCenterData);
    }).catch((error) => {
        console.error("Error getting documents:", error);
    });
}

document.getElementById("city").addEventListener("change", () => {
    document.getElementById("medical-centers").innerHTML = ``;
    const province = provinceInput.value;
    const cityInputt = cityInput.value;
    updateMedicalCentersName(province, cityInputt);
});

document.getElementById("province").addEventListener("change", () => {
    document.getElementById("medical-centers").innerHTML = ``;
    updateCities();
});

async function updateMedicalCentersName(province, city) {
    let dataNames = [];
    const q = query(collection(db, "MedicalCenters"), where("province", "==", province), where("city", "==", city));
    getDocs(q).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            dataNames.push({
                email: doc.id,
                centerName: doc.data().medicalNameMedicalCenter
            });
        });
        fillSpinnerCentersName(dataNames);
    }).catch((error) => {
        console.error("Error getting documents:", error);
    });
}

medicalCentersSpinner.addEventListener("change", () => {
    infobutton.disabled = false;
});

infobutton.addEventListener("click", () => {
    let email = medicalCentersSpinner.value;
    let url = "medicaldata.html?email=" + encodeURIComponent(email);
    window.open(url, "_blank");
});

function fillSpinnerCentersName(data) {
    let centerName = document.getElementById("medical-centers");
    for (let center of data) {
        let content = `<option value="${center.email}">${center.centerName}</option>`;
        centerName.innerHTML += content;
    }
}

registerButton.addEventListener("click", function (event) {
    event.preventDefault();
    let centerName = document.getElementById("medical-centers");
    let centerEmail = centerName.value;
    const country = countryInput.value;
    const province = provinceInput.value;
    const city = cityInput.value;
    let bloodQuantity = Number(document.getElementById("blood-units").value);
    const scheduleDate = scheduleDateInput.value; // Capture the schedule date
    const scheduleTime = scheduleTimeInput.value; // Capture the schedule date
    addDocWithSpecificId(localStorage.getItem("email"), country, province, city, bloodQuantity, centerEmail, scheduleDate,scheduleTime); // Pass the date to the function
});

async function addDocWithSpecificId(email, country, province, city, bloodQuantity, centerEmail, scheduleDate,scheduleTime) {
    let ref = doc(db, "DonationRequests", email);
    await setDoc(ref, {
        email: email,
        country: country,
        province: province,
        city: city,
        bloodQuantity: bloodQuantity,
        status: "pending",
        deleted: "false",
        centerEmail: centerEmail,
        scheduleDate: scheduleDate,
        scheduleTime: scheduleTime,
    }).then(() => {
        alert("Thanks for donation");
        window.location = "./donorhomepage.html";
    }).catch((err) => {
        alert(err);
    });
}

function updateCities() {
    var provinceSelect = document.getElementById("province");
    var citySelect = document.getElementById("city");
    var province = provinceSelect.value;
    citySelect.innerHTML = "";
    
    var cities = [];
    switch (province) {
        case "Beirut":
            cities = ["Beirut City", "Achrafieh", "Hamra"];
            break;
        case "South Lebanon":
            cities = ["Tyre", "Sidon", "Jezzine"];
            break;
        case "North Lebanon":
            cities = ["Tripoli", "Bsharri", "Batroun"];
            break;
        case "Mount Lebanon":
            cities = ["Jounieh", "Zahle", "Byblos"];
            break;
        case "Bekaa":
            cities = ["Zahle", "Baalbek", "Rashaya"];
            break;
        case "Nabatieh":
            cities = ["Nabatieh", "Hasbaya", "Bint Jbeil"];
            break;
        case "Akkar":
            cities = ["Halba", "Akkar el Atika", "Kobayat"];
            break;
        case "Baabda":
            cities = ["Baabda", "Aley", "Chouf"];
            break;
        case "Bint Jbeil":
            cities = ["Bint Jbeil", "Aitaroun", "Ain Ebel"];
            break;
    }
    
    for (var i = 0; i < cities.length; i++) {
        var option = document.createElement("option");
        option.value = cities[i];
        option.text = cities[i];
        citySelect.appendChild(option);
    }
}