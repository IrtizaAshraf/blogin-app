import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
import { collection, addDoc, Timestamp, getDocs, where, query, orderBy, deleteDoc, updateDoc, doc } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";
import { auth, db } from './config.js';

const currentTime = new Date();
const currentHour = currentTime.getHours();
const time = document.querySelector('#time');

// Times of the day started

let greeting;
if (currentHour >= 5 && currentHour < 12) {
    greeting = 'Good Morning';
} else if (currentHour >= 12 && currentHour < 17) {
    greeting = 'Good Afternoon';
} else if (currentHour >= 17 && currentHour < 21) {
    greeting = 'Good Evening';
} else {
    greeting = 'Good Night';
}
console.log(greeting);

const text = document.createTextNode(`${greeting} Readers!`);
time.appendChild(text);

// Times of the day ended

const fetchUserData = async () => {
    const usersQuerySnapshot = await getDocs(collection(db, "users"));
    return usersQuerySnapshot.docs.map(user => user.data());
};

const fetchPosts = async () => {
    const postsQuerySnapshot = await getDocs(collection(db, "posts"));
    return postsQuerySnapshot.docs.map(doc => ({ ...doc.data(), docId: doc.id }));
};


// Render all blogs started

const renderAllBlogs = async () => {
    console.log("Rendering blogs...");
    const allBlogsArray = await fetchPosts();
    console.log("Fetched posts:", allBlogsArray);

    const userData = await fetchUserData();
    console.log("Fetched users:", userData);

    allBlogsArray.forEach(item => {
        const user = userData.find(user => user.uid === item.uid);

        console.log("User:", user);

        const time = item.postDate.seconds;
        const mydate = new Date(time * 1000);
        const formattedDate = mydate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        const postimg = user ? user.profileUrl : '';

        AllBlogsContainer.innerHTML += `
        <div class="bg-white p-8 rounded-lg mb-5 shadow-2xl max-w-xl ml-40 w-full">
            <div class="flex gap-5">
                <div class="mb-4 text-center">
                    <img src="${postimg}" class="rounded-xl w-20 h-20 mb-4" id="blog-img">
                </div>
                <div class="w-1/2">
                    <h2 class="text-xl font-bold text-[#212529]">${item.title}</h2>
                    <h5 class="text-sm mt-1 text-[#6C757D]">${user.firstName} ${user.lastName} ${formattedDate}</h5>
                </div>
            </div>
            <p class="text-[#6C757D] text-sm mt-3 whitespace-normal break-words">
                ${item.Descript}
            </p>
            <div class="flex mt-3 text-sm">
                <a href="userblog.html" class="bg-transparent border-none text-[#7749F8]  mr-20" id="user-link">See all from this user</a>
            </div>
        </div> `;

        console.log("Rendering post:", item);
    });

    console.log("Finished rendering blogs.");
};

// Render all blogs ended


document.addEventListener("DOMContentLoaded", async () => {
    console.log("DOM loaded, rendering blogs...");
    await renderAllBlogs();
});
