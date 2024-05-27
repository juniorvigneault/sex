// function trackResizeSpeed(newWindow, minScale, maxScale) {
//   let speeds = []; // Array to store resizing speeds

//   let lastWidth = newWindow.innerWidth;
//   let lastHeight = newWindow.innerHeight;
//   let lastResizeTime = Date.now();

//   newWindow.addEventListener("resize", () => {
//     const currentTime = Date.now();
//     const timeDifference = currentTime - lastResizeTime;

//     // Calculate the change in dimensions
//     const widthDifference = Math.abs(newWindow.innerWidth - lastWidth);
//     const heightDifference = Math.abs(newWindow.innerHeight - lastHeight);

//     // Calculate the total change in size
//     const totalChange = Math.sqrt(
//       widthDifference * widthDifference + heightDifference * heightDifference
//     );

//     // Calculate the speed of resizing (pixels per millisecond)
//     const speed = totalChange / timeDifference;

//     // Push the speed to the array
//     speeds.push(speed);

//     // Find the smallest and largest speeds in the array
//     let smallest = Math.min(...speeds);
//     let largest = Math.max(...speeds);

//     // Define the target range (0 to 10)
//     let targetMin = 0;
//     let targetMax = 10;

//     // Scale each speed to the range of 0 to 10
//     let scaledSpeeds = speeds.map((speed) => {
//       let scaledSpeed =
//         ((speed - minScale) / (maxScale - minScale)) * (targetMax - targetMin) +
//         targetMin;
//       // Ensure the scaled speed does not exceed the target maximum
//       return Math.min(scaledSpeed, targetMax);
//     });

//     resizingSpeed = Math.floor(scaledSpeeds[scaledSpeeds.length - 1]);

//     // Update last width, height, and resize time for next event
//     lastWidth = newWindow.innerWidth;
//     lastHeight = newWindow.innerHeight;
//     lastResizeTime = currentTime;
//   });
// }
