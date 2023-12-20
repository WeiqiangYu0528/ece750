export type modalType = {
    open: boolean,
    onClose: () => void,
    onCreatePost?: () => void,
}

export type sidebarType = {
    onCreatePost?: () => void,
}

export type thumbnailType = {
    media: string[],
    mediaType:string[],
    mediaIdx: number,
    setMediaIdx: any,
    handleFileChange: any,
    handleDelete: () => void,
}

export type modelFormType = {
    caption:string,
    setCaption: any,
    setHashtags: any,
}