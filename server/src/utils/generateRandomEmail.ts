export const generateRandomEmail = () => {
  const symbols = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let email= '';

  for (let i = 0; i < 10; i++) {
    email += symbols.charAt(Math.floor(Math.random() * symbols.length));
  }

  email += '@example.com';
  return email;
}