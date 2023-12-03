import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js';
import { auth, db } from './config.js';
import { collection, addDoc, getDocs, Timestamp, query, orderBy, deleteDoc, doc, updateDoc, where } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";

const userName = document.querySelector('#names')
const userNames = document.querySelector('#names')
const logout = document.querySelector('#logout')
const profileImage = document.querySelector('#image')
const profileImages = document.querySelector('#user-image')
const list = document.querySelector('#input-text');
// const description = document.querySelector('#textarea')
const form = document.querySelector('#form')
const card = document.querySelector('#card')


onAuthStateChanged(auth, async (user) => {
    if (user) {
        const uid = user.uid;
        console.log(uid);
        // get user data start
        const q = query(collection(db, "users"), where("uid", "==", uid));
        const querySnapshot = await getDocs(q);
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

// get data from fire store start
let arr = [];

//post data on firestore

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
        const postObj = {
            todoinput: list.value,
            uid: auth.currentUser.uid,
            postDate: Timestamp.fromDate(new Date())
        }
        const docRef = await addDoc(collection(db, "todolist"), postObj);
        console.log("Document written with ID: ", docRef.id);
        postObj.docId = docRef.id;
        arr = [postObj, ...arr];
        console.log(arr);
        renderPost();
    } catch (e) {
        console.error("Error adding document: ", e);
    }
})

// render list in hmoepage........
function renderPost() {
    card.innerHTML = ''
    arr.map((item) => {
        card.innerHTML += `
        <div class="card mt-2 w-[70%] bg-[#263d48] py-2 shadow-[#192124] ">
        <div class="card-body">
            <p class="text-[#fff]"><span class="h4 px-2">list Name:</span>${item.todoinput}</p>
            <p class="text-[#fff]"><span class="h4 px-2">postDate:</span>${item.postDate}</p>
            <div class="mt-[50px] gap-6">
            <button type="button" id="delete" class="btn btn-danger text-[#ffffff]">Delete</button>
            <button type="button" id="update" class="btn btn-info  text-[#ffffff]">Edit</button>
            </div>
        </div>
    </div>`
    })

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

    // const del = document.querySelectorAll('.btn-danger');
    // const upd = document.querySelectorAll('.btn-info');

    // del.forEach((btn) => {
    //     btn.addEventListener('click', async (e) => {
    //         const index = arr.findIndex(item => item.docId === e.target.dataset.index);
    //         console.log('delete called', arr[index]);
    //         await deleteDoc(doc(db, "todolist", arr[index].docId));
    //         arr.splice(index, 1);
    //         renderPost();
    //     });
    // });

    // upd.forEach((btn) => {
    //     btn.addEventListener('click', async (e) => {
    //         const index = arr.findIndex(item => item.docId === e.target.dataset.index);
    //         console.log('update called', arr[index]);

    //         const updatedList = prompt('Enter new Title');
    //         if (updatedList !== null) {
    //             await updateDoc(doc(db, "todolist", arr[index].docId), {
    //                 todoinput: updatedList
    //             });
    //             arr[index].todoinput = updatedList;
    //             renderPost();
    //         }
    //     });
    // });
}

async function getDataFromFirestore() {
    arr.length = 0;
    const q = query(collection(db, "todolist"), orderBy('postDate', 'desc'));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        console.log(doc.data());
        arr.push({ ...doc.data(), docId: doc.id });
    });
    console.log(arr);
    renderPost();
}
getDataFromFirestore()


//post data on firestore

// form.addEventListener('submit', async (event) => {
//     event.preventDefault();
//     try {
//         const postObj = {
//             todoinput: list.value,
//             todo: description.value,
//             uid: auth.currentUser.uid,
//             postDate: Timestamp.fromDate(new Date())
//         }
//         const docRef = await addDoc(collection(db, "todolist"), postObj);
//         console.log("Document written with ID: ", docRef.id);
//         postObj.docId = docRef.id;
//         arr = [postObj, ...arr];
//         console.log(arr);
//         renderPost();
//     } catch (e) {
//         console.error("Error adding document: ", e);
//     }
// })
// get data from fire store end




// async function getDataFromFirestore() {
//     const arr = []
//     const querySnapshot = await getDocs(collection(db, "todo"));
//     querySnapshot.forEach((doc) => {
//         arr.push(doc.data())
//     });
//     console.log(arr);
//     arr.map((item) => {
//         card.innerHTML += `
//         <div class="card w-75 mb-3 m-5 p-3 border-black">
//             <div class="card-body">
//                 <p class="card-text text-start"><span class="h6">Todo : </span>${item.text}</p>
//             </div>
//         </div>`
//     })
// }

// getDataFromFirestore()


// form.addEventListener('submit', async (event) => {
//     event.preventDefault();
//     card.innerHTML = ''
//     try {
//         const docRef = await addDoc(collection(db, "todo"), {
//             text: text.value,
//             uid: auth.currentUser.uid
//         });
//         console.log("Document written with ID: ", docRef.id);
//         getDataFromFirestore()
//     } catch (e) {
//         console.error("Error adding document: ", e);
//     }
// })