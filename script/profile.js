

//. import the funtion in firestore--------->
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js';
// import  the auth  in config.js
import { auth, db } from './config.js';
/// import the function refrence in firestore----------->
import { collection, addDoc, getDocs, Timestamp, query, orderBy, deleteDoc, doc, updateDoc, where } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";




/////  create a variable in todolist ------>
const userName = document.querySelector('#user-names')
const userNames = document.querySelector('#names')
const logout = document.querySelector('#logout')
const profileImage = document.querySelector('#image')
const profileImages = document.querySelector('#user-image')
// const list = document.querySelector('#input-text');
// const description = document.querySelector('#textarea')
// const form = document.querySelector('#form')
// const card = document.querySelector('#card')




onAuthStateChanged(auth, async (user) => {
      if (user) {
            const uid = user.uid;
            console.log(uid);
            // get user data start
            const q = query(collection(db, "users"));
            const querySnapshot = await getDocs(q);
            // console.log();
            querySnapshot.forEach((doc) => {
                  console.log(doc);
                  console.log(doc.data());
                  const lastName = doc.data().lastName;
                  const firstName = doc.data().firstName;
                  userName.innerHTML = lastName + ' ' + firstName;
                  userNames.innerHTML = lastName + ' ' + firstName;
                  profileImage.src = doc.data().profileUrl
                  profileImages.src = doc.data().profileUrl
            });
            // getDataFromFirestore()
            // get user data end
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




















//post data on firestore----------->
// async function getDataFromFirestore(uid) {
//       arr.length = 0;
//       const q = await query(collection(db, "todolist"), orderBy('postDate', 'desc'), where('uid', '==', uid));
//       const querySnapshot = await getDocs(q);
//       querySnapshot.forEach((doc) => {
//             console.log(doc.data());
//             arr.push({ ...doc.data(), docId: doc.id });
//       });
//       console.log(arr);
//       renderPost();
// }



















