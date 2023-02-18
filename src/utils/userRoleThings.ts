import type { Role } from "@prisma/client";

export const USER_ROLE_THINGS: {[key in Role]: {
    textColor: string,
    bg: string
}} = {
    user: {
        textColor: 'text-red-300',
        bg: 'bg-red-900'
    },
    admin: {
        textColor: 'text-green-300',
        bg: 'bg-green-900'
    },
    imperator: {
        textColor: 'text-green-300',
        bg: 'bg-green-900'
    }
}