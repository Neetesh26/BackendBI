import admin from "firebase-admin";
import serviceAccount from "../firebaseServiceKey.json";

admin.initializeApp({
  credential: admin.credential.cert(
    serviceAccount as admin.ServiceAccount
  ),
});

export default admin;