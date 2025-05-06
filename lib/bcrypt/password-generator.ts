import crypto from "crypto";

export default function generateStrongPassword(length = 12): string {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()-_=+[]{}<>?/";
  const all = uppercase + lowercase + numbers + symbols;
  const required = [
    uppercase[Math.floor(Math.random() * uppercase.length)],
    lowercase[Math.floor(Math.random() * lowercase.length)],
    numbers[Math.floor(Math.random() * numbers.length)],
    symbols[Math.floor(Math.random() * symbols.length)],
  ];
  const remainingLength = length - required.length;
  const randomChars = Array.from(crypto.randomBytes(remainingLength)).map(
    (byte) => all[byte % all.length]
  );
  const passwordArray = [...required, ...randomChars];
  for (let i = passwordArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
  }
  return passwordArray.join("");
}

export const getPasswordExpiration = () => {
  const today = new Date();
  const passwordExpiration = new Date(today);
  passwordExpiration.setMonth(today.getMonth() + 3);
  return passwordExpiration;
};
