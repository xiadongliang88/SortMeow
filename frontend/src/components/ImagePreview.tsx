import { useState, useEffect } from 'preact/hooks'

interface Props {
    filename: string
    class?: string
    id?: string
}

const ImagePreview = ({ filename, ...props }: Props) => {
    const [src, setSrc] = useState<string>('')

    useEffect(() => {
        const loadImage = async () => {
            const result = await (window as any).go.main.App.GetImage(filename)
            if (result.code === 0) {
                setSrc(result.data)
            }
        }
        loadImage()
    }, [filename])

    if (!src) return <div {...props} />

    return <img src={src} {...props} />
}

export default ImagePreview
