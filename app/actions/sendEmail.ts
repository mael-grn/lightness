"use server";

import Services from "@/app/services";

export async function sendEmailAction(email: string, identite: string, message: string) {
    return await Services.sendEmail(email, identite, message);
}