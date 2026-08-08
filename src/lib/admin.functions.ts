import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
const Input=z.object({passkey:z.string().min(1).max(200)});
export const verifyAdminPasskey=createServerFn({method:"POST"}).inputValidator((input:unknown)=>Input.parse(input)).handler(async({data})=>({ok:Boolean(process.env.ADMIN_ACCESS_KEY)&&data.passkey===process.env.ADMIN_ACCESS_KEY}));
