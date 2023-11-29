import { createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js';
import { auth, db, storage } from './config.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-storage.js'

const form = document.querySelector('#form');
const firstName = document.querySelector('#frist-name');
const lastName = document.querySelector('#last-name');
const email = document.querySelector('#email');
const password = document.querySelector('#Password');
const repeatPassword = document.querySelector('#repeat-password');
// const modalMessage = document.querySelector('#modal-message');
const uploadPhoto = document.querySelector('#profile-image');


form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (password.value !== repeatPassword.value) {
            console.log('password are not same');
            Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: "Something went wrong Repeat password !",
                 
            });
            return
      }
      const files = uploadPhoto.files[0]
      const storageRef = ref(storage, firstName.value);
      uploadBytes(storageRef, files).then(() => {
            getDownloadURL(storageRef).then((url) => {
                  createUserWithEmailAndPassword(auth, email.value, password.value)
                        .then((userCredential) => {
                              const user = userCredential.user;
                              console.log(user);
                              addDoc(collection(db, "users"), {
                                    firstName: firstName.value,
                                    lastName: lastName.value,
                                    email: email.value,
                                    uid: user.uid,
                                    profileUrl: url
                              }).then((res) => {
                                    console.log(res);
                                    window.location = 'login.html'
                              }).catch((err) => {
                                    console.log(err);
                              })
                        })
            })
                  .catch((error) => {
                        const errorMessage = error.message;
                        console.log(errorMessage);
                        Swal.fire({
                              icon: "error",
                              title: "Oops...",
                              text: "! Already invalid a user ",
                              
                        });
                  });
      })

            .catch((error) => {
                  const errorMessage = error.message;
                  console.log(errorMessage);
            });

})