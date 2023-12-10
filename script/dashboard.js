import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js';
import { auth, db } from './config.js';
import { collection, addDoc, getDocs, Timestamp, query, orderBy, deleteDoc, doc, updateDoc, where, increment, } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";

const userName = document.querySelector('#names')
const userNames = document.querySelector('#names')
const logout = document.querySelector('#logout')
const profileImage = document.querySelector('#image')
const profileImages = document.querySelector('#user-image')
const form = document.querySelector('#form')
const card = document.querySelector('#card')



const rightNow = new Date();
const day = rightNow.getDate();
const month = rightNow.toLocaleString('default', { month: 'long' });
const year = rightNow.getFullYear();

const hours = rightNow.getHours();
const minutes = rightNow.getMinutes();
const ampm = hours >= 12 ? 'pm' : 'am';
const hours12 = hours % 12 || 12;

const formattedTime = `${day} ${month} ${year} ${hours12}:${String(minutes).padStart(2, '0')}${ampm}`;

console.log(formattedTime);
let userObj;

onAuthStateChanged(auth, async (user) => {
      if (user) {
            const uid = user.uid;
            console.log(uid);
            // get user data start
            const q = query(collection(db, "users"), where("uid", "==", uid));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                  // console.log(doc);
                  console.log(doc.data());
                  userObj = doc.data()
                  console.log(userObj);
                  const lastName = doc.data().lastName;
                  const firstName = doc.data().firstName;
                  userName.innerHTML = firstName + ' ' + lastName;
                  userNames.innerHTML = firstName + ' ' + lastName;
                  profileImage.src = doc.data().profileUrl
                  profileImages.src = doc.data().profileUrl
            });

            // get user data end
            getDataFromFirestore(uid)
      } else {
            window.location = './login.html'
      }
});

//   logOut start
logout.addEventListener('click', () => {
      signOut(auth).then(() => {
            console.log('logout successfull');
            window.location = 'login.html'
      }).catch((error) => {
            console.log(error);
      });
})
//   logOut End

// get data from fire store start
let arr = [];



//post data on firestore

form.addEventListener('submit', async (event) => {
      event.preventDefault();


      const postTitle = document.getElementById('tittle').value;
      const postDescription = document.getElementById('description').value;

      console.log(postTitle);
      console.log(postDescription);

      if (postTitle === '' || postDescription === '') {
            alert('Please fill in both title and description.');
      } else {
            try {
                  const user = auth.currentUser;
                  const uid = user.uid;

                  const postObj = {
                        title: postTitle,
                        description: postDescription,
                        uid: uid,
                        postDate: formattedTime,
                        userObj

                  };

                  const docRef = await addDoc(collection(db, "posts"), postObj);
                  console.log("Document written with ID: ", docRef.id);

                  postObj.docId = docRef.id;
                  arr = [postObj, ...arr];
                  console.log(arr);

                  // Instead of clearing individual fields, reset the form
                  form.reset();

                  renderPost();
            } catch (error) {
                  console.error("Error adding document: ", error);
            }
      }
});




// render list in hmoepage........
function renderPost() {
      const user = auth.currentUser;
      card.innerHTML = ''
      arr.map((item) => {
            const postimg = user ? user.profileUrl : '';

            card.innerHTML += `
            <div class="bg-white p-8 rounded-lg mb-5 shadow-2xl max-w-xl ml-40 w-full">
                  <div class="flex gap-5">
                      <div class="mb-4 text-center">
                          <img src="${item.userObj.profileUrl}" class="rounded-xl w-20 h-20 mb-4" id="blog-img">
                      </div>
                      <div class="w-1/2">
                          <h2 class="text-xl font-bold text-[#212529]">${item.title}</h2>
                          <h5 class="text-sm mt-1 text-[#6C757D]">${item.userObj.firstName + item.userObj.lastName} ${formattedTime}</h5>
                      </div>
                       <div class="dropdown dropdown-end">
                              
                                    <div tabindex="0" role="button">
                                          
                                        <div class="relative  w-6 h-6 cursor-pointer ">
                                          <i class="fa-solid fa-ellipsis-vertical "></i>
                                        </div>   
                                         
                                    </div>
                                    <ul tabindex="0"
                                          class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                                         
                                          <li><a id="delete">Delete</a></li>
                                          <li><a id="update">Edit</a></li>
                                    </ul>
                        </div>
                     
      
                  </div>
                  <p class="text-[#6C757D] text-sm mt-3 whitespace-normal break-words">
                      ${item.description}
                  </p>
                  
                  <div class="post" data-post-id="postId">
                        <!-- ... Other post content ... -->
                        <button class="like-button">Like</button>
                        <span class="like-count">0</span>
                  </div>

            
            </div>
      `
      })


      //  like funcanationaltyy  section start --------------->>


      // import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';

      // Select all like buttons
      const likeButtons = document.querySelectorAll('.like-button');


      // Add click event listeners to each like button
      likeButtons.forEach((button) => {
            button.addEventListener('click', async () => {
                  // Get the postId from the data-post-id attribute
                  const postId = button.closest('.post').dataset.postId;
                  console.log();

                  // Check if postId is available
                  if (postId) {
                        // Call the likePost function
                        await likePost(postId);
                  }
            });
      });

      // Function to handle liking a post
      async function likePost(postId) {
            // Reference to the post document in Firestore
            const postRef = doc(db, "posts", postId);

            // Get the current like count
            const postSnapshot = await getDocs(postRef);
            const currentLikes = postSnapshot.data().likes || 0;

            
            const updateData = {
                  likes: increment(1),
                  // other fields...
            };

            console.log('Data to be updated:', updateData);

            await updateDoc(postRef, updateData);


            // Update the UI with the new like count
            updateLikeCount(postId, currentLikes + 1);
      }

      // Function to update the like count in the UI
      function updateLikeCount(postId, newLikes) {
            const likeCountSpan = document.querySelector(`.post[data-post-id="${postId}"] .like-count`);
            if (likeCountSpan) {
                  likeCountSpan.textContent = newLikes;
            }
      }

      //  like funcanationaltyy  section end --------------->>


      const del = document.querySelectorAll('#delete');
      const upd = document.querySelectorAll('#update');

      del.forEach((btn, index) => {
            btn.addEventListener('click', async () => {
                  console.log('delete called', arr[index]);
                  await deleteDoc(doc(db, "posts", arr[index].docId))
                        .then(() => {
                              console.log('post deleted');
                              arr.splice(index, 1);
                              renderPost()
                        });
            })
      })
      upd.forEach((btn, index) => {
            btn.addEventListener('click', async () => {
                  console.log('update called', arr[index]);

                  const updatedList = prompt('enter new Title');
                  await updateDoc(doc(db, "posts", arr[index].docId), {
                        title: updatedList
                  });
                  arr[index].title = updatedList;
                  renderPost()

            })
      })


}
renderPost()

async function getDataFromFirestore(uid) {
      arr.length = 0;
      const q = query(collection(db, "posts"), orderBy('postDate', 'desc'), where('uid', '==', uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
            console.log(doc.data());
            arr.push({ ...doc.data(), docId: doc.id });
      });
      console.log(arr);
      renderPost();
}
// getDataFromFirestore(uid)


//post data on firestore
















// this is code in another file==->
/* <div class="flex mt-3 text-sm">
                      <a href="userblog.html" class="bg-transparent border-none text-[#7749F8]  mr-20" id="user-link">See all from this user</a>
                  </div> */