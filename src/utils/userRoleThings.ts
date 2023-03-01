import type { Role } from "@prisma/client";
import { type StaticImageData } from "next/image";

export const USER_ROLE_THINGS: {[key in Role]: {
    textColor: string,
    bg: string,
    icon: StaticImageData | string
}} = {
    user: {
        textColor: 'text-red-300',
        bg: 'bg-red-900',
        icon: 'ok'
    },
    admin: {
        textColor: 'text-green-300',
        bg: 'bg-green-900',
        icon: 'ok'
    },
    imperator: {
        textColor: 'text-green-300',
        bg: 'bg-green-900',
        icon: 'ok'
    }
}
