import { getStorage, ref, getDownloadURL } from "firebase/storage";

const getImageUrl = async (sportName) => {
  const storage = getStorage();
  const possibleExtensions = ["jpg", "jpeg"];

  for (const ext of possibleExtensions) {
    const imageRef = ref(storage, `${sportName}.${ext}`);
    try {
      const url = await getDownloadURL(imageRef);
      return url;
    } catch (error) {
      // Continue to try the next extension
    }
  }

  console.error("Error fetching image from Firebase Storage. Image not found.");
  return null;
};

export { getImageUrl };
