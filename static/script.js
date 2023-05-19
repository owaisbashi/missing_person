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

// Upload button click event
uploadButton.addEventListener('click', () => {
    const selectedImage = imageUpload.files[0];
    if (selectedImage) {
        const formData = new FormData();
        formData.append('image', selectedImage);

        fetch('/upload', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                // Perform image comparison and display the result
                // You can implement your own image comparison logic here

                // Update the comparison result section with the result
                const result = document.getElementById('result');
                result.textContent = 'Comparison Result: ...';
            })
            .catch(error => {
                console.error('Error uploading image:', error);
            });
    }
});
