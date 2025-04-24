"use client";
export default function ErrorMessage({
  errorMessage,
}: {
  errorMessage: string;
}) {
  return <p className="text-red-500">{errorMessage}</p>;
}
