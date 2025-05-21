import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../firebase.config";
export const fileUploader = async (file: File): Promise<string> => {
  try {
    const storageRef = ref(storage, `estudios-radiograficos/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.log(error);
    return "";
  }
};
