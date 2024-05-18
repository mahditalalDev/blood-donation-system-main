let info = [];
let index = 0;
let buttons = [];

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
  getDocs,
  setDoc,
  collection,
  increment,
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

const donationRequestCollectionRef = collection(db, "DonationRequests");

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("sign-out-btn").addEventListener("click", signOut);
  document.getElementById("spinner").addEventListener("change", filterRequests);
  fetchRequests(); // Initial fetch
});

async function fetchRequests() {
  const centerEmail = localStorage.getItem("email");
  const q = query(
    donationRequestCollectionRef,
    where("centerEmail", "==", centerEmail)
  );

  try {
    const querySnapshot = await getDocs(q);
    const requests = querySnapshot.docs.map((doc) => ({
      donorEmail: doc.id,
      data: doc.data(),
    }));
    const donorInfos = await fetchDonorInfo(requests);
    fillTable(donorInfos);
  } catch (error) {
    console.error("Error fetching requests:", error);
  }
}

async function fetchDonorInfo(requests) {
  const donorInfos = await Promise.all(
    requests.map(async (request) => {
      const docRef = doc(db, "MedicalInfo", request.donorEmail);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { donorInfo: docSnap.data(), requestInfo: request };
      }
      return null;
    })
  );
  return donorInfos.filter((info) => info !== null);
}

function fillTable(requests) {
  const tableBody = document.getElementById("tablebody");
  tableBody.innerHTML = "";

  requests.forEach(({ donorInfo, requestInfo }) => {
    const status = requestInfo.data.status;
    const statusBackground = getStatusBackground(status);

    tableBody.insertAdjacentHTML(
      "beforeend",
      `
      <tr>
        <td>${donorInfo.firstName} ${donorInfo.lastName}</td>
        <td>${requestInfo.data.bloodQuantity}</td>
        <td>${donorInfo.bloodType}</td>
        <td>${requestInfo.data.city}</td>
        <td><span style="${statusBackground}">${status}</span></td>
        <td>${donorInfo.phoneNumber}</td>
        <td>
          <button class="more-btn" data-donor-email="${
            requestInfo.donorEmail
          }" style="padding:10px;border-radius:5px">More</button>
        </td>
        <td>
          <div id="done-btn" style="display:flex;justify-content:center;gap:5px">
            ${getActionButtons(status, donorInfo, requestInfo)}
          </div>
        </td>
        <td style:"text-align:center" >
        <div  class="reminder-btn"  data-donor-email="${
          requestInfo.donorEmail
        }" >
        <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" 
        height="1.2em" viewBox="0 0 14 14"><path fill="#4139ac" 
        fill-rule="evenodd" d="M11.821.098a1.62 1.62 0 0 1 2.077
         2.076l-3.574 10.712a1.62 1.62 0 0 1-1.168 1.069a1.599 1.599 
         0 0 1-1.52-.434l-1.918-1.909l-2.014 1.042a.5.5 0 0 1-.73-.457l.083-3.184l7.045-5.117a.625.625 0 1 
         0-.735-1.012L2.203 8.088l-1.73-1.73a1.6 1.6 0 0 1-.437-1.447a1.62 
         1.62 0 0 1 1.069-1.238h.003L11.82.097Z" clip-rule="evenodd"/></svg>
         
        </div>
       
         </td>
        <td>${
          requestInfo.data.scheduleDate
            ? new Date(requestInfo.data.scheduleDate).toLocaleDateString()
            : "N/A"
        }</td>
        <td>${
          requestInfo.data.scheduleTime
            ? new Date(requestInfo.data.scheduleTime).toLocaleTimeString()
            : "N/A"
        }</td>
      </tr>
    `
    );
  });

  addEventListeners();
}

function getStatusBackground(status) {
  switch (status) {
    case "pending":
    case "rejected":
    case "accepted":
      return "color: black;";
    default:
      return "white";
  }
}

function getActionButtons(status, donorInfo, requestInfo) {
  if (status === "pending") {
    return `
      <button class="accept-btn" data-donor-bloodType="${donorInfo.bloodType}" data-donor-bloodQuantity="${requestInfo.data.bloodQuantity}" data-donor-email="${requestInfo.donorEmail}" style="color:black;padding:10px;border-radius:5px">Accept</button>
      <button class="reject-btn" data-donor-email="${requestInfo.donorEmail}" style="color:black;padding:10px;border-radius:5px">Reject</button>
    `;
  } else if (status === "accepted") {
    return `<span style="padding: 5px; border-radius: 5px;">Accepted</span>`;
  } else if (status === "rejected") {
    return `<span style="padding: 5px; border-radius: 5px;">Rejected</span>`;
  }
  return "";
}

function addEventListeners() {
  document.querySelectorAll(".more-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const donorEmail = this.getAttribute("data-donor-email");
      window.open(`../qrreader.html?email=${donorEmail}`, "_blank");
    });
  });
  function composeEmail(donorEmail) {
    const toField = encodeURIComponent(donorEmail);
    const subject = encodeURIComponent("Reminder Request for Blood Donation");
    const body = encodeURIComponent("write your body here");
    const gmailUrl = `https://mail.google.com/mail/?view=cm&to=${toField}&su=${subject}&body=${body}&fs=1&tf=1`;

    // Open Gmail compose window after filling fields
    window.open(gmailUrl, "_blank");
  }
  document.querySelectorAll(".reminder-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const donorEmail = this.getAttribute("data-donor-email");
      composeEmail(donorEmail);
    });
  });

  document.querySelectorAll(".accept-btn").forEach((button) => {
    button.addEventListener("click", async function () {
      const donorEmail = this.getAttribute("data-donor-email");
      const donorBloodType = this.getAttribute("data-donor-bloodType");
      const donorBloodQuantity = this.getAttribute("data-donor-bloodQuantity");
      await updateRequestStatus(donorEmail, "accepted");
      await updateBloodBank(donorBloodType, donorBloodQuantity);
    });
  });

  document.querySelectorAll(".reject-btn").forEach((button) => {
    button.addEventListener("click", async function () {
      const donorEmail = this.getAttribute("data-donor-email");
      await updateRequestStatus(donorEmail, "rejected");
    });
  });
}

async function updateBloodBank(bloodType, bloodQuantity) {
  const docRef = doc(db, "BloodBanks", localStorage.getItem("email"));
  await updateDoc(docRef, { [bloodType]: increment(bloodQuantity) });
  console.log(`Updated ${bloodType} by ${bloodQuantity}`);
}

async function updateRequestStatus(donorEmail, status) {
  const ref = doc(db, "DonationRequests", donorEmail);
  await updateDoc(ref, { status });

  // Update the table based on the current filter
  const selectedFilter = document.getElementById("spinner").value;
  if (selectedFilter === "all") {
    fetchRequests();
  } else {
    fetchRequestsByStatus(selectedFilter);
  }
}

async function fetchRequestsByStatus(status) {
  const centerEmail = localStorage.getItem("email");
  const q = query(
    donationRequestCollectionRef,
    where("centerEmail", "==", centerEmail),
    where("status", "==", status)
  );

  try {
    const querySnapshot = await getDocs(q);
    const requests = querySnapshot.docs.map((doc) => ({
      donorEmail: doc.id,
      data: doc.data(),
    }));
    const donorInfos = await fetchDonorInfo(requests);
    fillTable(donorInfos);
  } catch (error) {
    console.error("Error fetching requests:", error);
  }
}

function filterRequests() {
  const selectedStatus = document.getElementById("spinner").value;
  if (selectedStatus === "all") {
    fetchRequests();
  } else {
    fetchRequestsByStatus(selectedStatus);
  }
}

function signOut() {
  const confirmation = confirm("Are you sure you want to logout?");
  if (confirmation) {
    localStorage.clear();
    window.location.href = "../index.html";
  }
}

const navigation = document.querySelector(".navigation");
const toggle = document.querySelector(".toggle");
const main = document.querySelector(".main");

toggle.addEventListener("click", () => {
  navigation.classList.toggle("active");
  main.classList.toggle("active");
});
