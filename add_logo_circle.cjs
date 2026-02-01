const Jimp = require('jimp');
const path = require('path');

async function addCircleToLogo(inputPath, outputPath, colorHex, borderWidth = 30, padding = 50) {
    try {
        console.log(`Processing: ${inputPath} -> ${outputPath}`);
        const logo = await Jimp.read(inputPath);

        const width = logo.bitmap.width;
        const height = logo.bitmap.height;
        const maxDim = Math.max(width, height);

        const newSize = maxDim + (padding * 2) + (borderWidth * 2);
        const radius = (newSize / 2) - (borderWidth / 2) - 10; // Slight margin

        // Create new white image
        const newImg = new Jimp(newSize, newSize, 0xFFFFFFFF); // White background

        // Convert hex to int (Jimps uses 0xRRGGBBFF or css colors? Jimp.cssColorToInt is reliable)
        // If colorHex is #E32017 -> we assume full opacity.
        // We will scan a circle and draw.

        // Draw Circle Loop (Manual drawing as Jimp primitives are limited/buggy sometimes)
        // Or simpler: scan all pixels and check distance from center.

        const centerX = newSize / 2;
        const centerY = newSize / 2;
        const rOuter = radius + (borderWidth / 2);
        const rInner = radius - (borderWidth / 2);

        // Parse Color
        // #E32017
        const r = parseInt(colorHex.substring(1, 3), 16);
        const g = parseInt(colorHex.substring(3, 5), 16);
        const b = parseInt(colorHex.substring(5, 7), 16);
        const colorInt = Jimp.rgbaToInt(r, g, b, 255);

        newImg.scan(0, 0, newSize, newSize, function (x, y, idx) {
            const dist = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
            if (dist >= rInner && dist <= rOuter) {
                // Set pixel color
                this.bitmap.data[idx + 0] = r;
                this.bitmap.data[idx + 1] = g;
                this.bitmap.data[idx + 2] = b;
                this.bitmap.data[idx + 3] = 255;
            }
        });

        // Composite Logo
        const xPos = (newSize - width) / 2;
        const yPos = (newSize - height) / 2;

        newImg.composite(logo, xPos, yPos);

        await newImg.writeAsync(outputPath);
        console.log(`Saved: ${outputPath}`);

    } catch (error) {
        console.error("Error:", error);
    }
}

// Execute
(async () => {
    // Red #E32017
    await addCircleToLogo(
        'public/logo.png',
        'public/client-logos/mind-the-job-logo-final-red.png',
        '#E32017',
        30,
        50
    );

    // Blue #111827 (Navy)
    await addCircleToLogo(
        'public/logo.png',
        'public/client-logos/mind-the-job-logo-final-navy.png',
        '#111827',
        30,
        50
    );
})();
