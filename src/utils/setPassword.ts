import { createHmac } from "crypto";

export const setPassword = (originalText: string, number: string) => {
  const salt = `${originalText}${number}mqwjkelrtoPASGDFHX0982364751<>?:"}{][';/.,+_)(*!@#$%^&PhdBXMC,EWADF\|VVnmbvcxzsrykjk)]}`;
  const hash = createHmac("sha512", salt).update(originalText).digest("hex");
  return hash.slice(0, 15);
};
