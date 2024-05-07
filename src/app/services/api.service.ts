import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { addDoc } from 'firebase/firestore';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  getDocs,
  query,
  updateDoc,
} from '@angular/fire/firestore';
import {
  GoogleAuthProvider,
  signOut,
  Auth
} from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, catchError, map, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private router: Router, private afAuth: AngularFireAuth, private fs: Firestore, private http: HttpClient,private auth: Auth,private storage: Storage) { }
  loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    this.afAuth.signInWithPopup(provider).then((res: any) => {
      if (res) {
        if (res.additionalUserInfo.isNewUser) {
          const userData = {
            uid: res.user.uid,
            email: res.additionalUserInfo.profile.email ? res.additionalUserInfo.profile.email : '',
            username: res.additionalUserInfo.profile.name ? res.additionalUserInfo.profile.name : '',
            lcusername: '',
            picture: res.additionalUserInfo.profile.picture ? res.additionalUserInfo.profile.picture : '',
            createdAt: new Date(),
            points:0,
            attempt: 0
          }
          this.postDocument(res.user.uid, 'userinfo', 'data', userData).then(() => {
            localStorage.setItem(
              'currentUserToken',
              JSON.stringify({
                token: res?.credential?.accessToken,
                email: res?.user?.email,
                uid: res?.user?.uid,
              })
            );
            this.router.navigate(['home'])
          }).catch((err) => {
            console.log(err);

          })
        }
        else {
          localStorage.setItem(
            'currentUserToken',
            JSON.stringify({
              token: res?.credential?.accessToken,
              email: res?.user?.email,
              uid: res?.user?.uid,
            })
          );
          this.router.navigate(['home'])
        }
      }
    })
  }


  async postDocument(
    uid: any,
    id: string,
    subcollectionName: string,
    data: any
  ): Promise<any> {
    const documentRef = doc(this.fs, uid, id);
    const subcollectionRef = collection(documentRef, subcollectionName);

    const subdocumentRef = await addDoc(subcollectionRef, { ...data });
    await updateDoc(subdocumentRef, { id: subdocumentRef.id });
    return true
  }
  getDocument(id: string, subcollectionName: string): Observable<any[]> {
    const uid = this.getUid()
    const documentRef = doc(this.fs, uid, id);
    const subcollectionRef = query(
      collection(documentRef, subcollectionName)
    );
    return collectionData(subcollectionRef) as Observable<any[]>;
  }
  async updateDocument(
    path: string,
    subcollectionName: string,
    updatedData: any
  ): Promise<void> {
    const uid = this.getUid();
    const documentRef = doc(this.fs, uid, path);
    const subcollectionRef = collection(documentRef, subcollectionName);
    const querySnapshot = await getDocs(subcollectionRef);
    const documentToUpdate = querySnapshot.docs.find(
      (doc) => doc.id === updatedData.id
    );
    if (documentToUpdate) {
      const subdocumentRef = doc(subcollectionRef, documentToUpdate!.id);
      await updateDoc(subdocumentRef, updatedData).then(() => {
      })
    }
  }
  getUid() {
    const currentUser = localStorage.getItem('currentUserToken')
    if (currentUser) {
      const parsed = JSON.parse(currentUser)
      if (parsed.uid && parsed.token) {
        return parsed.uid
      } else {
        this.router.navigate(['/login'])
      }
    } else {
      this.router.navigate(['/login'])
    }
  }
  getToken() {
    const currentUserToken = localStorage.getItem('currentUserToken')
    if (currentUserToken) {
      return JSON.parse(currentUserToken);
    } else {
      return null;
    }
  }
  getUserInfo(): Observable<any> {
    let userInfo = localStorage.getItem('userinfo');
    if (userInfo) {
      return of(JSON.parse(userInfo));
    } else {
      return this.getDocument('userinfo', 'data').pipe(
        map(res => {
          userInfo = res[0];
          if (userInfo)
            localStorage.setItem('userinfo', JSON.stringify(userInfo));
          return userInfo;
        }),
        catchError(error => {
          console.error('Error fetching user info:', error);
          return of(null); // Return null if there's an error
        })
      );
    }
  }
  isAuth() {
    return localStorage.getItem('currentUserToken') ? true : false;
  }
  logout() {
    signOut(this.auth)
      .then(() => {
        localStorage.removeItem('currentUserToken');
        localStorage.removeItem('userinfo');
      })
      .catch((e) => {
        console.log(e);
      });
    return true;
  }

async uploadImage(img_blob:Blob,img_name: string): Promise<string | null> {
  if (img_blob) {
    const filePath = `images/${img_name}`;
    const storageRef = ref(this.storage, filePath);

    try {
      const uploadTask = uploadBytesResumable(storageRef, img_blob);
      await uploadTask;
      const url = await getDownloadURL(storageRef);
      console.log('Uploaded URL:', url);
      return url;
    } catch (error) {
      console.error('Upload Error:', error);
      alert(error);
      return null; // Return null in case of an error
    }
  }

  return null; // Return null if file is missing
}
}
