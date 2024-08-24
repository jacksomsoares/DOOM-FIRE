(function() {
  const fireWidth = 80;
  const fireHeight = 80;
  const firePixelsArray = new Uint8Array(fireWidth * fireHeight);
  const fireColorsPalette = [{"r":7,"g":7,"b":7},{"r":31,"g":7,"b":7},{"r":47,"g":15,"b":7},{"r":71,"g":15,"b":7},{"r":87,"g":23,"b":7},{"r":103,"g":31,"b":7},{"r":119,"g":31,"b":7},{"r":143,"g":39,"b":7},{"r":159,"g":47,"b":7},{"r":175,"g":63,"b":7},{"r":191,"g":71,"b":7},{"r":199,"g":71,"b":7},{"r":223,"g":79,"b":7},{"r":223,"g":87,"b":7},{"r":223,"g":87,"b":7},{"r":215,"g":95,"b":7},{"r":215,"g":95,"b":7},{"r":215,"g":103,"b":15},{"r":207,"g":111,"b":15},{"r":207,"g":119,"b":15},{"r":207,"g":127,"b":15},{"r":207,"g":135,"b":23},{"r":199,"g":135,"b":23},{"r":199,"g":143,"b":23},{"r":199,"g":151,"b":31},{"r":191,"g":159,"b":31},{"r":191,"g":159,"b":31},{"r":191,"g":167,"b":39},{"r":191,"g":167,"b":39},{"r":191,"g":175,"b":47},{"r":183,"g":175,"b":47},{"r":183,"g":183,"b":47},{"r":183,"g":183,"b":55},{"r":207,"g":207,"b":111},{"r":223,"g":223,"b":159},{"r":239,"g":239,"b":199},{"r":255,"g":255,"b":255}];
  let ctx;
  const canvas = document.createElement('canvas');
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.display = "block";
  document.body.append(canvas);
  
  document.documentElement.style.height = "100%";

  function start() {
    createFireSource();
    initializeHtmlPixels();
    renderFire();

    //const intervalId = setInterval(calculateFirePropagation, 50);

    let animationFrameId;
    let previousTimeStamp = undefined;
    const animationStep = (timestamp) => {
      if (previousTimeStamp === undefined) { previousTimeStamp  = timestamp }

      //if ( ((timestamp - previousTimeStamp) > 50) )
        calculateFirePropagation();

      previousTimeStamp = timestamp;
      animationFrameId = requestAnimationFrame(animationStep);
    };
    animationFrameId = requestAnimationFrame(animationStep);
    setTimeout(() => {      
      cancelAnimationFrame(animationFrameId)
      console.log("Animation stoped");
    }, 30000);
  }

  function initializeHtmlPixels() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    addEventListener("resize", () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;      
    });

    ctx = canvas.getContext("2d");

    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function createFireSource() {
    firePixelsArray.fill(36, firePixelsArray.length - fireWidth);
  }

  function calculateFirePropagation() {
    for (let col=0; col<fireWidth; ++col) {
      for (let row=0; row<fireHeight; ++row) {
        const pixelIndex = col + (fireWidth*row);
        const newIntensity = updateFireIntensityByPixel(pixelIndex);
      }
    }

    renderFire();
  }

  function updateFireIntensityByPixel(currentPixelIndex) {
    const belowPixelIndex = currentPixelIndex + fireWidth;
    if (belowPixelIndex >= fireWidth * fireHeight){ return; }

    const decay = Math.floor(Math.random() * 3);
    const belowPixelFireIntensity = firePixelsArray[belowPixelIndex];
    let newFireIntensity = belowPixelFireIntensity - decay;
    newFireIntensity = newFireIntensity < 0 ? 0 : newFireIntensity
    
    firePixelsArray[currentPixelIndex - decay] = newFireIntensity;
    return newFireIntensity;
  }

  function renderFire() {
    for(let row=0; row<fireHeight; ++row) {
      for(let col=0; col<fireWidth ; ++col) {
        const pixelIndex = col + (fireWidth * row);
        const fireIntensity = firePixelsArray[pixelIndex];

        const color = fireColorsPalette[fireIntensity];
        ctx.fillStyle = `rgb(${color.r},${color.g},${color.b})`;

        const widthScale = (canvas.width/fireWidth);
        const heightScale = (canvas.height/fireHeight);
        ctx.fillRect(col*widthScale, row*heightScale, widthScale, heightScale);
      }
    }
  }

  start();  
})();
