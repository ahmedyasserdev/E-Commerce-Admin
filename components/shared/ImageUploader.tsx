'use client';

import { useState , useEffect } from "react";
import { Button } from "../ui/button";
import { Plus, Trash } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from 'next-cloudinary';

type  ImageUploaderProps = {
    disabled? : boolean ;
    onChange : (value : string ) => void;
    onRemove : (value : string ) => void,
    value : string[]
}

const ImageUploader = (  {disabled , onChange , onRemove , value} : ImageUploaderProps) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    
    
    const onUpload = (result : any) => {
      onChange(result.info.secure_url);
    }
    
    if (!isMounted) return null;
  return (
    <div>
         <div className="mb-4 flex items-center gap-4">
                {value.map((url) => (
                    <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
                        <div className="z-10 absolute top-2 right-2">
                            <Button type="button" onClick={() => onRemove(url)} variant="destructive" size="icon">
                                <Trash className="h-4 w-4" />
                            </Button>
                        </div>
                        <Image
                            fill
                            className="object-cover"
                            alt="image"
                            src={url}
                        />
                    </div>
                ))}
            </div>


        <CldUploadWidget uploadPreset="adminEcommerce9988" onUpload={onUpload}>
  {({ open }) => {
    return (
      <Button variant = "secondary" disabled = {disabled}  type  = "button"  onClick={() => open()}>
        <Plus className = "size-5 mr-2" />
        Upload an image
      </Button>
    );
  }}
</CldUploadWidget>
                




    </div>
  )
}

export default ImageUploader