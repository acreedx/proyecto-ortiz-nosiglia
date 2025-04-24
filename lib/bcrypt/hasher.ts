import bcrypt from "bcryptjs";
const SALTING_ROUNDS = 10;

export const hashPassword = async (password: string) => {
  const hashedPassword = await bcrypt.hash(password, SALTING_ROUNDS);
  return hashedPassword;
};
