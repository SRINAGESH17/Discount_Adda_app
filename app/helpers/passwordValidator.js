export function numberValidator(number) {
  if (!number) {
    return "Password can't be empty.";
  } else if (number.length <= 6) {
    return 'password  should be at least 6 digits.';
  }
  return '';
}
