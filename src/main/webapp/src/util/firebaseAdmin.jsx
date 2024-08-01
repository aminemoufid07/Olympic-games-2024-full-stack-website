import admin from "firebase-admin";
import serviceAccount from "path/to/serviceAccountKey.json" assert { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const auth = admin.auth();
export default auth;
