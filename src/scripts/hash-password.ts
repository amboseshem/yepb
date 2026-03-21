import bcrypt from "bcryptjs";

async function main() {
  const plainPassword = "Ambrose@123";
  const hash = await bcrypt.hash(plainPassword, 10);
  console.log("Plain password:", plainPassword);
  console.log("Password hash:", hash);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});