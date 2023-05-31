// Fetch images from the server
fetch('/imagesret')
    .then(response => response.json())
    .then(data => {
        const imageList = document.getElementById('image-list');
        data.forEach(image => {
            const imgElement = document.createElement('img');
            imgElement.src = image;
            imageList.appendChild(imgElement);
        });
    })
    .catch(error => {
        console.error('Error fetching images:', error);
    });

// Image upload

const imageUpload = document.getElementById('image-upload');
const uploadButton = document.getElementById('upload-button');

console.log(imageUpload);
console.log(uploadButton);

// Upload button click event
uploadButton.addEventListener('click', () => {
  const selectedImage = imageUpload.files[0];
  if (selectedImage) {
    const formData = new FormData();
    formData.append('image', selectedImage);

    if ("geolocation" in navigator) {
      // Get the user's geolocation
      navigator.geolocation.getCurrentPosition(
        function(position) {
          // Success callback
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          // Append latitude and longitude as separate file fields
          formData.append('latitude', new File([latitude], 'latitude.txt'));
          formData.append('longitude', new File([longitude], 'longitude.txt'));

          // Call a separate function to handle form submission with geolocation data and image
          submitForm(formData);
        },
        function(error) {
          // Error callback
          console.error("Error getting geolocation:", error);
          // Submit the form without geolocation data
          document.getElementById("uploadForm").submit();
        }
      );
    } else {
      console.error("Geolocation not supported");
      // Submit the form without geolocation data
      document.getElementById("uploadForm").submit();
    }

    // console.log(formData.get('latitude'));

    // ... Rest of your code ...

  }
});

// Function to handle form submission
function submitForm(formData) {
  fetch('/check', {
    method: 'POST',
    body: formData
  })
    .then(response => response.json())
    .then(data => {
      // Perform image comparison and display the result
      // You can implement your own image comparison logic here

      // Update the comparison result section with the result
      // const result = document.getElementById('result');
      // result.textContent = 'Comparison Result: ...';

      // Update the person's name in the HTML
      const nameElement = document.getElementById('name');
      nameElement.textContent = `Name: ${data.message}`;

      // Update the person's location in the HTML
      const locationElement = document.getElementById('location');
      locationElement.textContent = `Location: ${data.place}`;



      console.log(data);
      console.log("hello");
    })
    .catch(error => {
      console.error('Error uploading image:', error);
    });
}






//check


// const imageUpload = document.getElementById('image-upload');
// const uploadButton = document.getElementById('upload-button');

// console.log(imageUpload)
// console.log(uploadButton)

// // Upload button click event
// uploadButton.addEventListener('click', () => {
//     const selectedImage = imageUpload.files[0];
//     if (selectedImage) {
//         const formData = new FormData();
//         formData.append('image', selectedImage);

//         if ("geolocation" in navigator) {

//             // Get the user's geolocation
//             navigator.geolocation.getCurrentPosition(
//               function(position) {
//                 // Success callback
//                 const latitude = position.coords.latitude;
//                 const longitude = position.coords.longitude;
        
//                 // Add the geolocation data to the form
//               //   const form = document.getElementById("uploadForm");
//                 const hiddenLatitude = document.createElement("input");
//                 hiddenLatitude.type = "hidden";
//                 hiddenLatitude.name = "latitude";
//                 hiddenLatitude.value = latitude;
//                 console.log(hiddenLatitude);
//                 formData.append('latitude',hiddenLatitude);

//                 console.log(formData.get('latitude'));
        
//                 const hiddenLongitude = document.createElement("input");
//                 hiddenLongitude.type = "hidden";
//                 hiddenLongitude.name = "longitude";
//                 hiddenLongitude.value = longitude;
//                 formData.append('longitude',hiddenLongitude);
      
//       //                  formData.forEach((value, key) => {
//       //     console.log(`Key: ${key}, Value: ${value}`);
//       //   });
        
        
//                 // Submit the form
//                 formData.submit();
//               return hiddenLongitude;
//               },
//               function(error) {
//                 // Error callback
//                 console.error("Error getting geolocation:", error);
//                 // Submit the form without geolocation data
//                 document.getElementById("uploadForm").submit();
//               }
//             );
      
            
//           } else {
//             console.error("Geolocation not supported");
//             // Submit the form without geolocation data
//             document.getElementById("uploadForm").submit();
//           }


//           console.log(formData.get('latitude'));
        

//         fetch('/check', {
//             method: 'POST',
//             body: formData
//         })
//             .then(response => response.json())
//             .then(data => {
//                 // Perform image comparison and display the result
//                 // You can implement your own image comparison logic here

//                 // Update the comparison result section with the result
//                 // const result = document.getElementById('result');
//                 // result.textContent = 'Comparison Result: ...';
//                 // console.log(data);
//                 console.log("hello");
//             })
//             .catch(error => {
//                 console.error('Error uploading image:', error);
//             });
//     }
// });


// function uploadWithGeolocation(formData) {
//     if ("geolocation" in navigator) {

//       // Get the user's geolocation
//       navigator.geolocation.getCurrentPosition(
//         function(position) {
//           // Success callback
//           const latitude = position.coords.latitude;
//           const longitude = position.coords.longitude;
  
//           // Add the geolocation data to the form
//         //   const form = document.getElementById("uploadForm");
//           const hiddenLatitude = document.createElement("input");
//           hiddenLatitude.type = "hidden";
//           hiddenLatitude.name = "latitude";
//           hiddenLatitude.value = latitude;
//           formData.append('latitude',hiddenLatitude);
  
//           const hiddenLongitude = document.createElement("input");
//           hiddenLongitude.type = "hidden";
//           hiddenLongitude.name = "longitude";
//           hiddenLongitude.value = longitude;
//           formData.append('longitude',hiddenLongitude);

// //                  formData.forEach((value, key) => {
// //     console.log(`Key: ${key}, Value: ${value}`);
// //   });
  
  
//           // Submit the form
//         //   form.submit();
//         return hiddenLongitude;
//         },
//         function(error) {
//           // Error callback
//           console.error("Error getting geolocation:", error);
//           // Submit the form without geolocation data
//           document.getElementById("uploadForm").submit();
//         }
//       );

      
//     } else {
//       console.error("Geolocation not supported");
//       // Submit the form without geolocation data
//       document.getElementById("uploadForm").submit();
//     }
//   }
  
