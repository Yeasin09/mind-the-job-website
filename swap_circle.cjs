const Jimp = require('jimp');

async function swapCircleColor(inputPath, outputPath) {
    try {
        console.log(`Loading: ${inputPath}`);
        const img = await Jimp.read(inputPath);

        const width = img.bitmap.width;
        const height = img.bitmap.height;
        const centerX = width / 2;
        const centerY = height / 2;

        // Define colors
        // Target Red: #E32017
        const redHex = 0xE32017FF;

        // Source Blue (Approximate, from inspection likely #111827 or #003688)
        // We will match "Dark Blueish" pixels.

        // Define a "Safe Radius".
        // The logo text and bridge are in the center. The circle is outside.
        // Let's guess the circle starts around 80% to 95% of the half-width.
        // We will scan from the OUTSIDE in.

        // Better strategy:
        // Find the "outermost" non-white pixel to determine the outer edge of the circle.
        // Find the "innermost" pixel of that contiguous block to find the ring thickness.
        // Then loop through all pixels in that ring and force them to RED.

        // 1. Scan from top-center down to find Top Edge
        let topEdgeY = 0;
        for (let y = 0; y < centerY; y++) {
            const hex = img.getPixelColor(centerX, y);
            const rgba = Jimp.intToRGBA(hex);
            if (rgba.a > 0 && (rgba.r < 250 || rgba.g < 250 || rgba.b < 250)) { // Non-white/transparent
                topEdgeY = y;
                break;
            }
        }

        console.log(`Top Edge identified at Y=${topEdgeY}`);

        // 2. Scan a bit further down to see where the ring ends (Inner Edge)
        let innerEdgeY = topEdgeY;
        for (let y = topEdgeY; y < centerY; y++) {
            const hex = img.getPixelColor(centerX, y);
            const rgba = Jimp.intToRGBA(hex);
            // If we hit white/transparent again, that's the inside of the ring
            if (rgba.a === 0 || (rgba.r > 250 && rgba.g > 250 && rgba.b > 250)) {
                innerEdgeY = y;
                break;
            }
        }
        console.log(`Inner Edge identified at Y=${innerEdgeY}`);

        const outerRadius = centerY - topEdgeY;
        const innerRadius = centerY - innerEdgeY;

        console.log(`Detected Ring: Outer Radius ~${outerRadius}, Inner Radius ~${innerRadius}`);

        // Safety margin. Only replace pixels strictly within this band (with loose tolerance)
        const safeOuter = outerRadius + 5;
        const safeInner = innerRadius - 2;

        // 3. Process Pixels
        img.scan(0, 0, width, height, function (x, y, idx) {
            const dist = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);

            // Check if within the ring zone
            if (dist <= safeOuter && dist >= safeInner) {
                // Check if the pixel is NOT white/transparent (it's part of the blue ring)
                const r = this.bitmap.data[idx + 0];
                const g = this.bitmap.data[idx + 1];
                const b = this.bitmap.data[idx + 2];
                const a = this.bitmap.data[idx + 3];

                // If it's visible and dark-ish (blue), swap it.
                // We don't want to swap anti-aliased white edges to full red, it looks jagged.
                // We should keep the alpha/intensity but change the hue.

                if (a > 20 && (r < 200 || g < 200 || b < 200)) {
                    // Simple swap: Set RGB to Red #E32017
                    this.bitmap.data[idx + 0] = 0xE3; // R
                    this.bitmap.data[idx + 1] = 0x20; // G
                    this.bitmap.data[idx + 2] = 0x17; // B
                    // keep alpha
                }
            }
        });

        await img.writeAsync(outputPath);
        console.log(`Saved modified image to ${outputPath}`);

    } catch (err) {
        console.error(err);
    }
}

// Run it
swapCircleColor(
    'C:/Users/yeasi/.gemini/antigravity/brain/e3f37b07-894d-4758-b374-a58139559b55/uploaded_media_1769865646445.png',
    'public/client-logos/mind-the-job-logo-REPLACED-RED.png'
);
