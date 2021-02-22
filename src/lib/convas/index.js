class CanvasBitmap {

  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  }

  update(bitmap) {
    let output = null;
    if (bitmap.isCompress) {
      throw new Error('Bitmap is compressed')
    } else {
      output = this.reverse(bitmap);
    }

    // use image data to use asm.js
    const imageData = this.ctx.createImageData(output.width, output.height);
    imageData.data.set(output.data);
    this.ctx.putImageData(imageData, bitmap.destLeft, bitmap.destTop);
  }

  /**
   * Un compress bitmap are reverse in y axis
   */
  reverse(bitmap) {
    return { width: bitmap.width, height: bitmap.height, data: new Uint8ClampedArray(bitmap.data) };
  }

}

export default CanvasBitmap
