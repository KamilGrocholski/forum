import clsx from "clsx"
import { type StaticImageData } from "next/image"
import ImageWithFallback from "./ImageWithFallback"

import DefaultAvatar from '../../assets/default_avatar.jpg'

export interface UserAvatarProps {
    src?: string | null | StaticImageData
    fallbackSrc?: string | StaticImageData
    className?: string
    width: number
    height: number
    alt: string
}

const UserAvatar: React.FC<UserAvatarProps> = ({
    src,
    fallbackSrc = DefaultAvatar,
    width,
    height,
    alt,
    className
}) => {
    return (
        <ImageWithFallback
            alt={alt}
            src={src ?? ''}
            fallbackSrc={fallbackSrc}
            width={width}
            height={height}
            className={clsx(
                'rounded-full w-fit h-fit',
                className
            )}
        />
    )
}

export default UserAvatar