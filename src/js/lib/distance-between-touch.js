export default function distanceBetweenTouch(touch1, touch2) {
  return Math.sqrt(Math.pow((touch2.clientX - touch1.clientX), 2) + Math.pow((touch2.clientY - touch1.clientY), 2));
}
