const { api } = require('@penpot/core');

// This function will manipulate the image and change black pixels to a specific color
function changeBlackToColor(image, colorHex) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = image.width;
    canvas.height = image.height;

    // Draw the image on the canvas
    context.drawImage(image, 0, 0);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Loop through pixels and change black ones to the target color
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        if (r < 50 && g < 50 && b < 50) {
            // Replace black with target color
            data[i] = parseInt(colorHex.slice(1, 3), 16);
            data[i + 1] = parseInt(colorHex.slice(3, 5), 16);
            data[i + 2] = parseInt(colorHex.slice(5, 7), 16);
        }
    }

    context.putImageData(imageData, 0, 0);

    return canvas.toDataURL(); // Return image as a data URL
}

// Main function to apply the color change to the selected image
async function applyColorChangeToImage() {
    const selectedElements = await api.selection.get(); // Get selected elements in Penpot

    selectedElements.forEach(element => {
        if (element.type === 'IMAGE') {
            const imageUrl = element.url;  // Get image URL from Penpot element

            const img = new Image();
            img.src = imageUrl;
            img.onload = () => {
                const modifiedImageURL = changeBlackToColor(img, '#FF0000'); // Change black to red

                // Update the Penpot element with the modified image URL
                api.document.updateElement(element.id, {
                    url: modifiedImageURL // Set the new image URL
                });
            };
        }
    });
}

// This will initialize the plugin
applyColorChangeToImage();
