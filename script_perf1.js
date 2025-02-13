(function()
{
  const fireWidth = 40;
  const fireHeight = 40;
  const firePixelsArray = new Uint8Array(fireWidth * fireHeight);
  const fireColorsPalette = [{"r":7,"g":7,"b":7},{"r":31,"g":7,"b":7},{"r":47,"g":15,"b":7},{"r":71,"g":15,"b":7},{"r":87,"g":23,"b":7},{"r":103,"g":31,"b":7},{"r":119,"g":31,"b":7},{"r":143,"g":39,"b":7},{"r":159,"g":47,"b":7},{"r":175,"g":63,"b":7},{"r":191,"g":71,"b":7},{"r":199,"g":71,"b":7},{"r":223,"g":79,"b":7},{"r":223,"g":87,"b":7},{"r":223,"g":87,"b":7},{"r":215,"g":95,"b":7},{"r":215,"g":95,"b":7},{"r":215,"g":103,"b":15},{"r":207,"g":111,"b":15},{"r":207,"g":119,"b":15},{"r":207,"g":127,"b":15},{"r":207,"g":135,"b":23},{"r":199,"g":135,"b":23},{"r":199,"g":143,"b":23},{"r":199,"g":151,"b":31},{"r":191,"g":159,"b":31},{"r":191,"g":159,"b":31},{"r":191,"g":167,"b":39},{"r":191,"g":167,"b":39},{"r":191,"g":175,"b":47},{"r":183,"g":175,"b":47},{"r":183,"g":183,"b":47},{"r":183,"g":183,"b":55},{"r":207,"g":207,"b":111},{"r":223,"g":223,"b":159},{"r":239,"g":239,"b":199},{"r":255,"g":255,"b":255}];
  const fireHtmlPixels = [];
  const container = document.createElement("div");
  document.body.append(container);
  

  function start()
  {
    // createFireDataStructure(); not needed since Uint8Array defaults to 0;
    createFireSource();
    initializeHtmlPixels();
    renderFire();

    const intervalId = setInterval(calculateFirePropagation, 50);
    setTimeout(() => clearInterval(intervalId), 30000);
  }

  function createFireDataStructure() {
    const numberOfPixels = fireWidth * fireHeight;

    for (let i = 0; i < numberOfPixels; ++i) {
      firePixelsArray[i] = 0;
    }
  }

  function initializeHtmlPixels() {
    const table = document.createElement('table');
    table.classList.add("fire-table");

    for (let row=0; row<fireHeight; ++row) {
      const tableRow = document.createElement("tr");
      table.append(tableRow);

      for (let col=0; col<fireWidth ; ++col) {
        const tableCol = document.createElement("td");
        
        tableRow.append(tableCol);
        fireHtmlPixels.push(tableCol);
      }
    }

    container.replaceChildren(table);
  }

  function createFireSource() {
    firePixelsArray.fill(36, firePixelsArray.length - fireWidth);
  }

  function calculateFirePropagation() {
    for (let col=0; col<fireWidth; ++col) {
      for (let row = 0; row < fireHeight; ++row) {
        const pixelIndex = col + (fireWidth*row);
        const newIntensity = updateFireIntensityByPixel(pixelIndex);

        if (newIntensity) {
          const htmlPixel = fireHtmlPixels[pixelIndex];
          const color = fireColorsPalette[newIntensity];
          htmlPixel.classList.add("fire-table__column-fire");
          htmlPixel.style.backgroundColor = `rgb(${color.r},${color.g},${color.b})`;
        }
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
    const debug = false;

    for(let row=0; row<fireHeight; ++row) {
      for(let col = 0; col < fireWidth ; ++col) {
        const pixelIndex = col + (fireWidth * row);
        const fireIntensity = firePixelsArray[pixelIndex];
        const htmlPixel = fireHtmlPixels[pixelIndex];

        if (debug) {
          htmlPixel.classList.add("fire-table__column");
  
          const colIndex = document.createElement("span");
          colIndex.classList.add("fire-table__column__index");
          colIndex.append(pixelIndex);
  
          htmlPixel.replaceChildren(colIndex, fireIntensity);
        } else {
          const color = fireColorsPalette[fireIntensity];

          htmlPixel.classList.add("fire-table__column-fire");
          htmlPixel.style.backgroundColor = `rgb(${color.r},${color.g},${color.b})`;
        }
      }
    }
  }

  start();  
})();
