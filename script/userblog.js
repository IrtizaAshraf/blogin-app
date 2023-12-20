// import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
// import { collection, addDoc, Timestamp, getDocs, where, query, orderBy, deleteDoc, updateDoc, doc } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";
// import { auth, db } from './config.js';

// const fetchUserBlogs = async (userId) => {
//     try {
//         const userBlogs = [];
//         const querySnapshot = await getDocs(collection(db, 'blogs').where('userId', '==', userId));

//         querySnapshot.forEach((doc) => {
//             const blog = {
//                 title: doc.data().title,
//                 description: doc.data().description,
//                 formattedDate: doc.data().formattedDate,
//                 img: doc.data().img
//             };
//             userBlogs.push(blog);
//         });

//         return userBlogs;
//     } catch (error) {
//         console.error('Error fetching user blogs:', error);
//         throw error;
//     }
// };


// const displayUserBlogs = async (userId) => {
//     try {
//         const userBlogs = await fetchUserBlogs(userId);
//         const blogsContainer = document.querySelector('.user-blogs-container');
//         blogsContainer.innerHTML = '';
//         userBlogs.forEach((blog) => {
//             const { title, description } = blog;

//             const blogElement = document.createElement('div');
//             blogElement.classList.add('blog-item');

//             blogElement.innerHTML = `
//                 <div class="flex gap-5">
//                     <div class="mb-4 text-center">
//                         <!-- Assuming you have an image for the blog -->
//                         <img src="blog-image-url" class="rounded-xl w-20 h-20 mb-4" id="blog-img">
//                     </div>
//                     <div class="w-1/2">
//                         <h2 class="text-xl font-bold text-[#212529]">${title}</h2>
//                         <!-- Display other details of the blog as needed -->
//                     </div>
//                 </div>
//                 <p class="text-[#6C757D] text-sm mt-3 whitespace-normal break-words">${description}</p>
//             `;
//             blogsContainer.appendChild(blogElement);
//         });
//     } catch (error) {
//         console.error('Error fetching user blogs:', error);
//     }
// };
// const updateUserName = (userName) => {
//     const userFullNameElement = document.getElementById('userName');
//     userFullNameElement.textContent = `All from ${userName}`;
// };



// // import { collection, getDocs, where, query } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";
// import { db } from './config.js';

// const urlParams = new URLSearchParams(window.location.search);
// const userId = urlParams.get('uid');
// console.log(urlParams);

// const renderUserBlogs = async () => {
//     try {
//         const userQuery = query(collection(db, 'users'), where('uid', '==', userId));
//         const userSnapshot = await getDocs(userQuery);
//         const user = userSnapshot.docs.map(doc => doc.data())[0];
//         // console.log(user);

//         if (user) {
//             const userBlogsQuery = query(collection(db, 'posts'), where('uid', '==', userId));
//             const userBlogsSnapshot = await getDocs(userBlogsQuery);
//             const userBlogs = userBlogsSnapshot.docs.map(doc => ({ ...doc.data(), docId: doc.id }));
//             console.log(userBlogs);
//             const userBlogsContainer = document.querySelector('#UserBlogsContainer');
//             userBlogs.forEach(item => {
//                 const postTime = new Date(item.postDate.seconds * 1000).toLocaleDateString('en-US', {
//                     month: 'short',
//                     day: 'numeric',
//                     year: 'numeric'
//                 });

//                 let postImg = '';

//                 if (user) {
//                     postImg = user.profileUrl || '';
//                 }

//                 const blogHTML = `
//                     <div class="bg-white p-8 rounded-lg mb-5 shadow-2xl max-w-xl ml-40 w-full">
//                         <div class="flex gap-5">
//                             <div class="mb-4 text-center">
//                                 <img src="${postImg}" class="rounded-xl w-20 h-20 mb-4" id="blog-img">
//                             </div>
//                             <div class="w-1/2">
//                                 <h2 class="text-xl font-bold text-[#212529]">${item.title}</h2>
//                                 <h5 class="text-sm mt-1 text-[#6C757D]">${user.firstName} ${user.lastName} ${postTime}</h5>
//                             </div>
//                         </div>
//                         <p class="text-[#6C757D] text-sm mt-3 whitespace-normal break-words">${item.description}</p>
//                     </div>
//                 `;

//                 userBlogsContainer.innerHTML += blogHTML;
//             });
//         }
//     } catch (error) {
//         console.error('Error fetching user blogs:', error);
//     }
// };

// document.addEventListener("DOMContentLoaded", async () => {
//     await renderUserBlogs();
// });














// const updateUserName = (userName) => {
//     const userFullNameElement = document.getElementById('userName');
//     userFullNameElement.textContent = `All from ${userName}`;
// };










// Import necessary functions from Firebase SDK
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
import { collection, where, query, getDocs } from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js';
import { auth, db } from './config.js';



const searchVal = document.querySelector("#search-value");

const userNames = document.querySelector('#names')

const userName = document.querySelector('#username')
const useremail = document.querySelector('#useremail')
const profileImage = document.querySelector('#image')
const specificpfp = document.querySelector("#userImg");



let arr = []


onAuthStateChanged(auth, async (user) => {
    if (user) {
        const uid = user.uid;
        console.log(uid);
        // get user data start
        const q = query(collection(db, "users"), where('uid', '==', uid));
        const querySnapshot = await getDocs(q);
        // console.log();
        querySnapshot.forEach((doc) => {
            // console.log(doc);
            console.log(doc.data());
            const lastName = doc.data().lastName;
            const firstName = doc.data().firstName;
            userNames.innerHTML = firstName + ' ' + lastName;
            profileImage.src = doc.data().profileUrl;


        });

        // get user data end
    } else {
        window.location = './index.html'
    }
});

const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('uid');
console.log(urlParams);

const renderUserBlogs = async () => {
    try {
        // Create a Firestore query for the 'users' collection
        const userQuery = query(collection(db, 'users'), where('uid', '==', userId));
        const userSnapshot = await getDocs(userQuery);
        const user = userSnapshot.docs.map(doc => doc.data())[0];

        if (user) {
            // Create a Firestore query for the 'posts' collection
            const userBlogsQuery = query(collection(db, 'posts'), where('uid', '==', userId));
            const userBlogsSnapshot = await getDocs(userBlogsQuery);
            const userBlogs = userBlogsSnapshot.docs.map(doc => ({ ...doc.data(), docId: doc.id }));
            console.log(userBlogs);

            const userBlogsContainer = document.querySelector('#UserBlogsContainer');
            userBlogs.forEach(item => {
                const postTime = new Date(item.postDate.seconds * 1000).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                });

                let postImg = '';

                if (user) {
                    postImg = user.profileUrl || '';
                }

                specificpfp.src = postImg;
                userName.innerHTML = `<h5 class="text-sm mt-1 text-[#2340a0d4]">${user.firstName} ${user.lastName} </h5>`;
                useremail.innerHTML = `<h1 class="text-sm mt-1 text-[#273a78]">${user.email} </h1>`;
                const blogHTML = `
                    <div class="bg-white p-8 rounded-lg mb-5 shadow-2xl max-w-xl ml-40 w-full">
                        <div class="flex gap-5">
                            <div class="mb-4 text-center">
                                <img src="${postImg}" class="rounded-xl w-20 h-20 mb-4" id="blog-img">
                            </div>
                            <div class="w-1/2">
                                <h2 class="text-xl font-bold text-[#212529]">${item.title}</h2>
                                <h5 class="text-sm mt-1 text-[#6C757D]">${user.firstName} ${user.lastName} ${postTime}</h5>
                            </div>
                        </div>
                        <p class="text-[#6C757D] text-sm mt-3 whitespace-normal break-words">${item.description}</p>
                    </div>
                `;

                userBlogsContainer.innerHTML += blogHTML;
            });
        }
    } catch (error) {
        console.error('Error fetching user blogs:', error);
    }
};




searchVal.addEventListener("input", () => {
    const filteredVal = searchVal.value.toLowerCase();
    // console.log(filteredVal);
    const filteredArr = arr.filter((item) => {
        return (
            item.title.toLowerCase().includes(filteredVal) ||
            item.caption.toLowerCase().includes(filteredVal)
        );
    });
    (filteredArr);
});

document.addEventListener("DOMContentLoaded", async () => {
    await renderUserBlogs();
});





function printt(posts) {
    div.innerHTML = "";
    posts.forEach((item, index) => {
        div.innerHTML += `
    <div style="font-family: 'Poppins', sans-serif;" class="bg-white  p-8 rounded-lg my-5  shadow-2xl max-w-xl  w-full " >
       <div class="flex gap-5">
       <div class="mb-4 text-center">
           <img src="${item.photoURL
            }" class="object-contain rounded-xl  w-32 h-32 mb-4" id="blog-img">
       </div>
        <div class="w-1/2">
        <h1 class="  text-3xl text-[#212529]">${item.title}</h1>
        <div  class="">
        <h3 class="text-sm mt-1 text-[#6C757D]">${item.displayName}</h5>
        <h3 class="text-sm mt-1  text-[#6C757D]"> ${formatDate(
                        item.postDate
                    )}</h3></div>
        </div>
          </div > 
        
           <div class=" relative">
        
           <p  class="text-[#868686]  text-[14px] font-light mt-2 whitespace-normal break-words">
           ${item.caption}
           </p>
           </div>
           </div>
          `;
            });
}
