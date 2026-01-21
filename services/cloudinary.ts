// export async function uploadToCloudinary(uri: string) {
//   const cloudName = "dssgcqc3n";
//   const uploadPreset = "profile_avatars";

//   // Cloudinary unsigned upload endpoint
//   const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

//   const formData: any = new FormData();
//   formData.append("file", {
//     uri,
//     type: "image/jpeg",
//     name: "avatar.jpg",
//   } as any);
//   formData.append("upload_preset", uploadPreset);

//   const res = await fetch(url, {
//     method: "POST",
//     body: formData,
//   });

//   const data = await res.json();

//   if (data.secure_url) {
//     return data.secure_url;
//   }

//   throw new Error("Cloudinary upload failed");
// }
export async function uploadToCloudinary(uri: string) {
  const cloudName = "dssgcqc3n";
  const uploadPreset = "profile_avatars";

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const formData: any = new FormData();
  formData.append("file", {
    uri,
    type: "image/jpeg",
    name: "avatar.jpg",
  } as any);
  formData.append("upload_preset", uploadPreset);

  const res = await fetch(url, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  console.log("Cloudinary Response:", data);  // 👈 IMPORTANT

  if (data.secure_url) {
    return data.secure_url;
  }

  throw new Error(data.error?.message || "cloudinary upload failed");
}
export function uploadToCloudinaryWithProgress(
  uri: string,
  onProgress: (percent: number) => void
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const cloudName = "dssgcqc3n";
      const uploadPreset = "profile_avatars";

      const apiUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

      const xhr = new XMLHttpRequest();

      xhr.open("POST", apiUrl);
      xhr.onload = () => {
        try {
          const response = JSON.parse(xhr.response);
          if (response.secure_url) {
            resolve(response.secure_url);
          } else {
            reject(new Error(response.error?.message || "Upload failed"));
          }
        } catch (err) {
          reject(err);
        }
      };

      xhr.onerror = () => reject(new Error("Network error"));

      // Progress event
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.floor((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };

      const formData: any = new FormData();
      formData.append("file", {
        uri,
        type: "image/jpeg",
        name: "avatar.jpg"
      } as any);
      formData.append("upload_preset", uploadPreset);

      xhr.send(formData);
    } catch (error) {
      reject(error);
    }
  });
}
