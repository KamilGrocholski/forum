import Image, { type StaticImageData, type ImageProps } from 'next/image'
import { forwardRef, useState } from 'react'

interface ImageWithFallbackProps extends ImageProps {
    fallbackSrc: string | StaticImageData
    alt: string
}

const ImageWithFallback = forwardRef<HTMLImageElement, ImageWithFallbackProps>(({
    fallbackSrc,
    alt,
    src,
    ...rest
}, ref) => {
    const [imgSrc, setImgSrc] = useState(src)

    return (
        <Image
            src={imgSrc}
            {...rest}
            alt={alt}
            ref={ref}
            onError={(error) => {
                setImgSrc(fallbackSrc)
            }}
            onLoadingComplete={(result) => {
                if (result.naturalWidth === 0) {
                    setImgSrc(fallbackSrc)
                }
            }}
        />
    )
})

ImageWithFallback.displayName = 'ImageWithFallback'

export default ImageWithFallback